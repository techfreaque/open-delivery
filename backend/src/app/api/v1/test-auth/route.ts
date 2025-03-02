import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "@/lib/env";

export async function GET(request: NextRequest) {
  // Get auth token from header
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Use the EXACT same secret key as used when generating tokens
    const JWT_SECRET_KEY = env.JWT_SECRET_KEY;
    const secretKey = new TextEncoder().encode(JWT_SECRET_KEY);

    console.log("Verifying token using secret:", JWT_SECRET_KEY);
    console.log("Token first 30 chars:", token.substring(0, 30));

    try {
      const { payload } = await jwtVerify(token, secretKey);

      console.log(
        "Token verification successful:",
        `${JSON.stringify(payload).substring(0, 100)}...`,
      );

      // Return decoded info to confirm token is valid
      return NextResponse.json({
        message: "Authentication successful",
        user: payload,
      });
    } catch (jwtError) {
      console.error(
        "JWT verification error details:",
        jwtError instanceof Error ? jwtError.message : "Unknown error",
      );

      // Try to parse the token for debugging
      try {
        const parts = token.split(".");
        if (parts.length === 3) {
          const header = JSON.parse(atob(parts[0]));
          console.log("Token header:", header);
        }
      } catch (parseError) {
        console.error("Failed to parse token for debugging");
      }

      throw jwtError;
    }
  } catch (error) {
    console.error("Token validation failed:", error);
    return NextResponse.json(
      {
        error: "Invalid token",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 401 },
    );
  }
}
