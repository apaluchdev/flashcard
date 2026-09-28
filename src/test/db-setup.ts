import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"
import type { TestProject } from "vitest/node"

// Vitest globalSetup for the "db" project: creates the test database if
// needed and applies all migrations. Requires Postgres (`npm run db:up`).
export default async function setup(project: TestProject) {
  const databaseUrl = project.config.env.DATABASE_URL
  if (!databaseUrl) throw new Error("The db test project needs env.DATABASE_URL")

  const url = new URL(databaseUrl)
  const name = url.pathname.slice(1)
  const quiet = { max: 1, onnotice: () => {} }

  const adminUrl = new URL(url)
  adminUrl.pathname = "/postgres"
  const admin = postgres(adminUrl.toString(), quiet)
  try {
    const [existing] = await admin`select 1 from pg_database where datname = ${name}`
    if (!existing) await admin.unsafe(`create database "${name.replaceAll('"', '""')}"`)
  } catch (error) {
    throw new Error(
      `Can't reach Postgres at ${adminUrl.host}. Start it with \`npm run db:up\`.`,
      { cause: error }
    )
  } finally {
    await admin.end()
  }

  const client = postgres(url.toString(), quiet)
  await migrate(drizzle(client), { migrationsFolder: "drizzle" })
  await client.end()
}
