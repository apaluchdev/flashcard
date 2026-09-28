import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"

import { auth } from "@/lib/auth"

/** The signed-in user, or null. Memoized for the duration of one request. */
export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
})

/**
 * The signed-in user; otherwise redirects to /sign-in and returns to
 * `returnTo` afterwards. Call at the top of protected pages and every
 * Server Action that writes data.
 */
export async function requireUser(returnTo?: string) {
  const user = await getCurrentUser()
  if (!user) {
    const query = returnTo ? `?next=${encodeURIComponent(returnTo)}` : ""
    redirect(`/sign-in${query}`)
  }
  return user
}
