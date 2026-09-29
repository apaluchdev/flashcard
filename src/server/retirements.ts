import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { cardRetirements, cards } from "@/db/schema"

// Per-user "retired" (memorized) cards. Anyone who can view a deck may
// retire its cards for themselves; every query is scoped by userId.

const isUuid = (id: string) => z.uuid().safeParse(id).success

/** Ids of the cards in `deckId` that `userId` has retired. */
export async function getRetiredCardIds(userId: string, deckId: string) {
  if (!isUuid(deckId)) return []
  const rows = await db
    .select({ cardId: cardRetirements.cardId })
    .from(cardRetirements)
    .where(and(eq(cardRetirements.userId, userId), eq(cardRetirements.deckId, deckId)))
  return rows.map((row) => row.cardId)
}

/**
 * Retires or unretires one card for the user. Returns false when the card
 * doesn't exist or doesn't belong to `deckId`. Idempotent.
 */
export async function setCardRetiredForUser(
  userId: string,
  deckId: string,
  cardId: string,
  retired: boolean
) {
  if (!isUuid(deckId) || !isUuid(cardId)) return false

  const [card] = await db
    .select({ id: cards.id })
    .from(cards)
    .where(and(eq(cards.id, cardId), eq(cards.deckId, deckId)))
  if (!card) return false

  if (retired) {
    await db.insert(cardRetirements).values({ userId, cardId, deckId }).onConflictDoNothing()
  } else {
    await db
      .delete(cardRetirements)
      .where(and(eq(cardRetirements.userId, userId), eq(cardRetirements.cardId, cardId)))
  }
  return true
}

/** Unretires every card of the deck for the user. Returns how many were unretired. */
export async function unretireAllForUser(userId: string, deckId: string) {
  if (!isUuid(deckId)) return 0
  const deleted = await db
    .delete(cardRetirements)
    .where(and(eq(cardRetirements.userId, userId), eq(cardRetirements.deckId, deckId)))
    .returning({ cardId: cardRetirements.cardId })
  return deleted.length
}
