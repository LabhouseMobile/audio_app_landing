import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Don't redirect /sh/* routes
  if (pathname.startsWith("/sh")) {
    return NextResponse.next();
  }

  // Redirect all other routes to summaryai.app
  return NextResponse.redirect(`https://summaryai.app${pathname}`, {
    status: 301,
  });
}

export const config = {
  // Match all routes except static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
