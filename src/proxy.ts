import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

// Runs before every page request:
// 1. Optimistic auth redirect for create/edit pages. It only checks for a
//    session cookie; real authorization happens in src/server (requireUser +
//    owner-scoped queries).
// 2. A per-request Content Security Policy with a script nonce, which
//    Next.js applies to its own inline scripts (the layout passes it to
//    next-themes).

const PROTECTED = [/^\/decks\/new$/, /^\/decks\/[^/]+\/edit$/]

// OAuth profile pictures.
const AVATAR_HOSTS = "https://avatars.githubusercontent.com https://*.googleusercontent.com"

function contentSecurityPolicy(nonce: string) {
  const isDev = process.env.NODE_ENV === "development"
  const isHttps = (process.env.BETTER_AUTH_URL ?? "").startsWith("https://")
  return [
    "default-src 'self'",
    // 'unsafe-eval' only in dev: React uses eval for debugging information.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Inline style attributes (React style props, Base UI, sonner) can't
    // carry a nonce. Inline scripts, the real XSS risk, stay nonce-only.
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' blob: data: ${AVATAR_HOSTS}`,
    "font-src 'self'",
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isHttps ? ["upgrade-insecure-requests"] : []),
  ].join("; ")
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (PROTECTED.some((route) => route.test(pathname)) && !getSessionCookie(request)) {
    const signIn = new URL("/sign-in", request.url)
    signIn.searchParams.set("next", pathname + search)
    return NextResponse.redirect(signIn)
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")
  const csp = contentSecurityPolicy(nonce)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)
  requestHeaders.set("Content-Security-Policy", csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set("Content-Security-Policy", csp)
  return response
}

export const config = {
  matcher: [
    {
      // Pages only: skip the auth API, static assets and files with extensions.
      source: "/((?!api|_next/static|_next/image|favicon.ico|.*\\.[a-z0-9]+$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
}
