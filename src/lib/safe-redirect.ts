/**
 * Returns `next` only if it is a same-site path ("/decks/new"), otherwise the
 * fallback. Prevents open redirects via `?next=https://evil.example`.
 */
export function safeRedirectPath(
  next: string | null | undefined,
  fallback = "/decks"
): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback
  if (next.includes("\\")) return fallback
  return next
}
