import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import { db } from "@/db"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
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
