import path from "node:path"

import { defineConfig } from "vitest/config"

/**
 * Integration tests use a separate database (the dev database name with a
 * `_test` suffix, or TEST_DATABASE_URL) so they never touch development data.
 */
function testDatabaseUrl() {
  if (process.env.TEST_DATABASE_URL) return process.env.TEST_DATABASE_URL
  try {
    process.loadEnvFile(".env")
  } catch {
    // No .env file; fall back to the environment / compose defaults.
  }
  const url = new URL(
    process.env.DATABASE_URL ?? "postgres://flashcard:flashcard@localhost:5432/flashcard"
  )
  url.pathname = `${url.pathname}_test`
  return url.toString()
}

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  test: {
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
          exclude: ["src/**/*.db.test.ts"],
        },
      },
      {
        // Integration tests against a real Postgres test database.
        extends: true,
        test: {
          name: "db",
          include: ["src/**/*.db.test.ts"],
          globalSetup: ["./src/test/db-setup.ts"],
          env: { DATABASE_URL: testDatabaseUrl() },
          fileParallelism: false,
        },
      },
    ],
  },
})
