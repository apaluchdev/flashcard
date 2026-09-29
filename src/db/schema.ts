import {
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

// Relative import: drizzle-kit loads this file without the "@/" alias.
import { VISIBILITIES } from "../lib/validation"
import { user } from "./auth-schema"

export * from "./auth-schema"

/** public = listed in search; private = unlisted, viewable by link only. */
export const visibility = pgEnum("visibility", VISIBILITIES)

export const decks = pgTable(
  "decks",
  {
    // Also the share-link id: /decks/{id}. Random, so not guessable.
    id: uuid().primaryKey().defaultRandom(),
    ownerId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text().notNull(),
    description: text(),
    visibility: visibility().notNull().default("private"),
    // Kept in sync by the deck Server Actions so search needs no join.
    cardCount: integer().notNull().default(0),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("decks_owner_updated_idx").on(t.ownerId, t.updatedAt.desc()),
    index("decks_visibility_updated_idx").on(t.visibility, t.updatedAt.desc()),
    // Trigram indexes back ILIKE '%q%' search (needs the pg_trgm extension).
    index("decks_title_trgm_idx").using("gin", t.title.op("gin_trgm_ops")),
    index("decks_description_trgm_idx").using(
      "gin",
      t.description.op("gin_trgm_ops")
    ),
  ]
)

export const cards = pgTable(
  "cards",
  {
    id: uuid().primaryKey().defaultRandom(),
    deckId: uuid()
      .notNull()
      .references(() => decks.id, { onDelete: "cascade" }),
    front: text().notNull(),
    back: text().notNull(),
    // Saved order, 0..n-1.
    position: integer().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("cards_deck_position_idx").on(t.deckId, t.position)]
)

/**
 * Cards a user has retired (memorized) — per user, so everyone who studies
 * a shared deck keeps their own progress. `deckId` is denormalized from the
 * card so one deck's retirements load with a single index lookup.
 */
export const cardRetirements = pgTable(
  "card_retirements",
  {
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    cardId: uuid()
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    deckId: uuid()
      .notNull()
      .references(() => decks.id, { onDelete: "cascade" }),
    retiredAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.cardId] }),
    index("card_retirements_user_deck_idx").on(t.userId, t.deckId),
  ]
)

export type Deck = typeof decks.$inferSelect
export type Card = typeof cards.$inferSelect
