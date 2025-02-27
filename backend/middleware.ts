import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path.startsWith("/auth/");

  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  // If the path is public, allow access
  if (isPublicPath) {
    // If user is already logged in and trying to access login page, redirect to dashboard
    if (token && path.startsWith("/auth/")) {
      try {
        if (process.env.NEXT_RUNTIME !== "edge") {
          const { verifyJWT } = await import("./lib/auth");
          await verifyJWT(token);
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Token is invalid, let them access the login page
      }
    }
    return NextResponse.next();
  }

  // If no token exists and path requires authentication, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  try {
    if (process.env.NEXT_RUNTIME !== "edge") {
      const { verifyJWT } = await import("./lib/auth");
      // Verify the token
      await verifyJWT(token);
      return NextResponse.next();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Token is invalid, redirect to login
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

// Configure which paths should be processed by the middleware
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes that don't require authentication
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /robots.txt (SEO files)
     */
    "/((?!api/auth|_next|static|favicon.ico|robots.txt).*)",
  ],
};
