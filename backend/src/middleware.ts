import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyJwt } from "@/lib/auth/jwt";
import { env } from "@/lib/env";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next();

  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.append("Access-Control-Allow-Origin", "*");
    response.headers.append(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.append(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
  }

  // Handle OPTIONS requests for CORS preflight
  if (request.method === "OPTIONS") {
    return response;
  }

  // Skip middleware for public routes and auth endpoints
  if (
    request.nextUrl.pathname.startsWith("/api/v1/auth") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/public") ||
    request.nextUrl.pathname.includes("favicon.ico")
  ) {
    return response;
  }

  // Skip middleware completely in test environment
  if (env.NODE_ENV === "test") {
    return response;
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

  try {
    // Verify the token
    await verifyJwt(tokenToVerify);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
