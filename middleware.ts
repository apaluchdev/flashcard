import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Override Next default's overaggressive caching behavior
  // Make all internal requests must revalidate every 15 seconds
  const url = request.nextUrl.clone();
  url.searchParams.append(
    "_nextCacheSkip",
    Math.floor(Date.now() / 1000 / 15).toString(),
  );

  return NextResponse.rewrite(url);
}
