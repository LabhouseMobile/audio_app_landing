import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const LEGACY_HOST = "sh.summaryai.app";
const CANONICAL_HOST = "sh.summary.ai";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // On Cloud Run (especially when fronted by an HTTPS Load Balancer), the
  // original public hostname may live in `x-forwarded-host` rather than
  // `host`. Check both, taking the first entry if it's a comma-separated list.
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const host = (forwardedHost || request.headers.get("host") || "")
    .toLowerCase();

  // Redirect the legacy domain (sh.summaryai.app) to the canonical one
  // (sh.summary.ai), preserving the path and query string.
  if (host === LEGACY_HOST) {
    const redirectUrl = new URL(
      `${pathname}${search}`,
      `https://${CANONICAL_HOST}`,
    );
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  // Redirect /sh/<id> to /<id> for backwards compatibility
  if (pathname.startsWith("/sh/")) {
    const id = pathname.replace("/sh/", "");
    return NextResponse.redirect(new URL(`/${id}`, request.url), {
      status: 301,
    });
  }

  return NextResponse.next();
}

export const config = {
  // Run on every request except Next.js internals and static assets, so we can
  // catch requests hitting the legacy host on any path.
  matcher: ["/((?!_next/|api/|favicon.ico|robots.txt|sitemap.xml).*)"],
};
