import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db/prisma";
import { errorLogger } from "@/lib/utils";

const inputSchema = z.object({
  uiid: z.string().min(1, "UIId is required"),
});

const getIp = async (): Promise<string> => {
  const _headers = await headers();
  const forwardedFor = _headers.get("x-forwarded-for");
  const realIp = _headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return "0.0.0.0";
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { uiid: UIId } = inputSchema.parse(body);

    const ip = await getIp();

    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip),
    );
    const hash = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    try {
      await prisma.uI.update({
        where: {
          id: UIId,
        },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
    } catch (dbError) {
      errorLogger("Database update error:", dbError);
      // Return success anyway to prevent client errors
    }

    return new NextResponse(null, { status: 202 });
  } catch (error) {
    errorLogger("Error in view-increment API route:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid input", details: error.errors }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
}
