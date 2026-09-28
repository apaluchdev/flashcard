import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

// Optimistic check only: it looks for a session cookie, not a valid session.
// Real authorization happens in src/server (requireUser + owner checks).
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next()

  const { pathname, search } = request.nextUrl
  const signIn = new URL("/sign-in", request.url)
  signIn.searchParams.set("next", pathname + search)
  return NextResponse.redirect(signIn)
}

export const config = {
  matcher: ["/decks/new", "/decks/:id/edit"],
}
