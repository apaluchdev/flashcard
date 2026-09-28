import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { cards, decks, user } from "@/db/schema"
import type { DeckInput, Visibility } from "@/lib/validation"

// Data access layer for decks. Every write is scoped by owner in its WHERE
// clause, so callers cannot edit another user's deck even with a forged id.
// Inputs are expected to be parsed with the zod schemas in lib/validation.

const isUuid = (id: string) => z.uuid().safeParse(id).success

/** Any deck by id (share links work for public and private decks). */
export async function getDeckForView(id: string) {
  if (!isUuid(id)) return null

  const [row] = await db
    .select({
      deck: decks,
      owner: { id: user.id, name: user.name, image: user.image },
    })
    .from(decks)
    .innerJoin(user, eq(user.id, decks.ownerId))
    .where(eq(decks.id, id))
  if (!row) return null

  const deckCards = await db
    .select({ id: cards.id, front: cards.front, back: cards.back })
    .from(cards)
    .where(eq(cards.deckId, id))
    .orderBy(asc(cards.position))

  return { ...row.deck, owner: row.owner, cards: deckCards }
}

/** The deck with its cards, or null if it doesn't exist or isn't the user's. */
export async function getDeckForEdit(id: string, userId: string) {
  if (!isUuid(id)) return null

  const [deck] = await db
    .select()
    .from(decks)
    .where(and(eq(decks.id, id), eq(decks.ownerId, userId)))
  if (!deck) return null

  const deckCards = await db
    .select({ id: cards.id, front: cards.front, back: cards.back })
    .from(cards)
    .where(eq(cards.deckId, id))
    .orderBy(asc(cards.position))

  return { ...deck, cards: deckCards }
}

/** Creates a deck owned by `userId`. Returns the new deck id. */
export async function createDeckForUser(userId: string, input: DeckInput) {
  return db.transaction(async (tx) => {
    const [deck] = await tx
      .insert(decks)
      .values({
        ownerId: userId,
        title: input.title,
        description: input.description,
        visibility: input.visibility,
        cardCount: input.cards.length,
      })
      .returning({ id: decks.id })

    if (input.cards.length > 0) {
      await tx.insert(cards).values(
        input.cards.map((card, position) => ({
          deckId: deck!.id,
          front: card.front,
          back: card.back,
          position,
        }))
      )
    }
    return deck!.id
  })
}

/**
 * Replaces the deck's metadata and card list. Cards are matched by id so
 * unchanged cards keep their ids; ids that don't belong to this deck are
 * treated as new cards. Returns false if the deck isn't the user's.
 */
export async function updateDeckForUser(
  id: string,
  userId: string,
  input: DeckInput
) {
  if (!isUuid(id)) return false

  return db.transaction(async (tx) => {
    const [deck] = await tx
      .update(decks)
      .set({
        title: input.title,
        description: input.description,
        visibility: input.visibility,
        cardCount: input.cards.length,
        updatedAt: new Date(),
      })
      .where(and(eq(decks.id, id), eq(decks.ownerId, userId)))
      .returning({ id: decks.id })
    if (!deck) return false

    const existing = new Map(
      (
        await tx
          .select({
            id: cards.id,
            front: cards.front,
            back: cards.back,
            position: cards.position,
          })
          .from(cards)
          .where(eq(cards.deckId, id))
      ).map((card) => [card.id, card])
    )

    const kept = new Set<string>()
    const inserts: (typeof cards.$inferInsert)[] = []
    const updates: { id: string; front: string; back: string; position: number }[] = []

    input.cards.forEach((card, position) => {
      const current = card.id ? existing.get(card.id) : undefined
      if (current && !kept.has(current.id)) {
        kept.add(current.id)
        if (
          current.front !== card.front ||
          current.back !== card.back ||
          current.position !== position
        ) {
          updates.push({ id: current.id, front: card.front, back: card.back, position })
        }
      } else {
        inserts.push({ deckId: id, front: card.front, back: card.back, position })
      }
    })

    const removed = [...existing.keys()].filter((cardId) => !kept.has(cardId))
    if (removed.length > 0) {
      await tx
        .delete(cards)
        .where(and(eq(cards.deckId, id), inArray(cards.id, removed)))
    }
    for (const { id: cardId, ...values } of updates) {
      await tx
        .update(cards)
        .set(values)
        .where(and(eq(cards.id, cardId), eq(cards.deckId, id)))
    }
    if (inserts.length > 0) await tx.insert(cards).values(inserts)

    return true
  })
}

/** Changes public/private. Returns false if the deck isn't the user's. */
export async function setDeckVisibilityForUser(
  id: string,
  userId: string,
  visibility: Visibility
) {
  if (!isUuid(id)) return false
  const updated = await db
    .update(decks)
    .set({ visibility, updatedAt: new Date() })
    .where(and(eq(decks.id, id), eq(decks.ownerId, userId)))
    .returning({ id: decks.id })
  return updated.length > 0
}

/** Deletes the deck (cards cascade). Returns false if it isn't the user's. */
export async function deleteDeckForUser(id: string, userId: string) {
  if (!isUuid(id)) return false
  const deleted = await db
    .delete(decks)
    .where(and(eq(decks.id, id), eq(decks.ownerId, userId)))
    .returning({ id: decks.id })
  return deleted.length > 0
}

export const SEARCH_PAGE_SIZE = 24
export const SEARCH_MAX_QUERY = 100

export type SearchScope = "public" | "mine"

/** Escapes LIKE wildcards so "100%" matches literally. */
const escapeLike = (text: string) => text.replace(/[\\%_]/g, "\\$&")

/**
 * Public decks, or the user's own decks (both visibilities), optionally
 * filtered by a case-insensitive substring of title or description (served
 * by the trigram indexes). With a query, title matches rank first, then by
 * similarity; otherwise newest first. Returns one page plus `hasMore`.
 */
export async function searchDecks({
  scope,
  userId,
  query = "",
  page = 1,
  pageSize = SEARCH_PAGE_SIZE,
}: {
  scope: SearchScope
  userId?: string
  query?: string
  page?: number
  pageSize?: number
}) {
  if (scope === "mine" && !userId) return { decks: [], hasMore: false }

  const q = query.trim().slice(0, SEARCH_MAX_QUERY)
  const pattern = `%${escapeLike(q)}%`
  const filters = [
    scope === "public" ? eq(decks.visibility, "public") : eq(decks.ownerId, userId!),
    q ? or(ilike(decks.title, pattern), ilike(decks.description, pattern)) : undefined,
  ]
  const order = q
    ? [
        sql`(${decks.title} ilike ${pattern}) desc`,
        sql`similarity(${decks.title}, ${q}) desc`,
        desc(decks.updatedAt),
      ]
    : [desc(decks.updatedAt)]

  const rows = await db
    .select({
      id: decks.id,
      title: decks.title,
      description: decks.description,
      visibility: decks.visibility,
      cardCount: decks.cardCount,
      updatedAt: decks.updatedAt,
      owner: { id: user.id, name: user.name, image: user.image },
    })
    .from(decks)
    .innerJoin(user, eq(user.id, decks.ownerId))
    .where(and(...filters))
    .orderBy(...order, desc(decks.id))
    // Fetch one extra row to know whether there is a next page.
    .limit(pageSize + 1)
    .offset((Math.max(1, page) - 1) * pageSize)

  return { decks: rows.slice(0, pageSize), hasMore: rows.length > pageSize }
}

export type DeckSummary = Awaited<ReturnType<typeof searchDecks>>["decks"][number]
