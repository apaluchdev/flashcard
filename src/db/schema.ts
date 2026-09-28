import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export * from "./auth-schema"

export const decks = pgTable("decks", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const cards = pgTable("cards", {
  id: uuid().primaryKey().defaultRandom(),
  deckId: uuid()
    .notNull()
    .references(() => decks.id, { onDelete: "cascade" }),
  front: text().notNull(),
  back: text().notNull(),
  position: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
