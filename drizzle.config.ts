import { defineConfig } from "drizzle-kit"

try {
  process.loadEnvFile(".env")
} catch {
  // No .env file; fall back to the environment.
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
