import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import { db } from "@/db"
import * as schema from "@/db/schema"
import { socialProvidersConfig } from "@/lib/auth-providers"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  // Only providers with both keys set in the environment (see .env.example).
  socialProviders: socialProvidersConfig(),
  account: {
    // Signing in with GitHub and Google using the same verified email
    // lands on one user instead of creating two.
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "google"],
    },
  },
  // Must stay last: lets Server Actions set auth cookies.
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
