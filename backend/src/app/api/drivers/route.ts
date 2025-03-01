import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

// GET available drivers (for admin or restaurant)
export async function GET(): Promise<NextResponse> {
  try {
    const drivers = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            name: {
              equals: "DRIVER",
            },
          },
        },
      },
    });

    return NextResponse.json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return new NextResponse(
      JSON.stringify({ message: "Could not fetch drivers" }),
      { status: 500 },
    );
  }
}

// POST create or update driver profile
export async function POST(): Promise<NextResponse> {
  return NextResponse.json({ message: "Created/updated driver" });
}
