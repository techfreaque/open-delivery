import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyJwt } from "@/lib/auth/jwt";

import { env } from "./lib/env";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Skip middleware for public routes
  if (request.nextUrl.pathname.startsWith("/api/v1/auth")) {
    return NextResponse.next();
  }

  // Skip middleware completely in test environment to allow tests to control auth
  if (env.NODE_ENV === "test") {
    return NextResponse.next();
  }

  // Get token from header or cookie
  const token = request.cookies.get("token")?.value;
  const authHeader = request.headers.get("Authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  const tokenToVerify = token || headerToken;

  // No token found
  if (!tokenToVerify) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Special case: accept test tokens in test mode
  if (
    env.NODE_ENV === "test" &&
    tokenToVerify.endsWith(".test_signature_for_e2e_tests")
  ) {
    return NextResponse.next();
  }

  try {
    // Verify the token
    await verifyJwt(tokenToVerify);
    return NextResponse.next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/v1/:path*"],
};
