import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /sh/<id> to /<id> for backwards compatibility
  if (pathname.startsWith("/sh/")) {
    const id = pathname.replace("/sh/", "");
    return NextResponse.redirect(new URL(`/${id}`, request.url), {
      status: 301,
    });
  }

  // Allow all other routes to pass through (they'll be handled by [id] dynamic route)
  return NextResponse.next();
}

export const config = {
  // Match /sh/* routes for redirect, all other routes pass through
  matcher: ["/sh/:path*"],
};
