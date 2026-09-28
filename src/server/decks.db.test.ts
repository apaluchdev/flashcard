import { randomUUID } from "node:crypto"

import { eq, inArray } from "drizzle-orm"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { db } from "@/db"
import { cards, decks, user } from "@/db/schema"
import { deckInput, type DeckInput } from "@/lib/validation"

import {
  createDeckForUser,
  deleteDeckForUser,
  getDeckForEdit,
  getDeckForView,
  setDeckVisibilityForUser,
  updateDeckForUser,
} from "./decks"

const owner = { id: `test-owner-${randomUUID()}`, name: "Owner" }
const other = { id: `test-other-${randomUUID()}`, name: "Other" }

beforeAll(async () => {
  await db.insert(user).values(
    [owner, other].map((u) => ({ ...u, email: `${u.id}@example.test` }))
  )
})

afterAll(async () => {
  // Decks and cards cascade from users.
  await db.delete(user).where(inArray(user.id, [owner.id, other.id]))
})

const input = (overrides: Partial<DeckInput> = {}): DeckInput =>
  deckInput.parse({
    title: "Spanish",
    cards: [
      { front: "Hola", back: "Hello" },
      { front: "Gracias", back: "Thank you" },
      { front: "Adiós", back: "Goodbye" },
    ],
    ...overrides,
  })

async function storedCards(deckId: string) {
  return db
    .select({ id: cards.id, front: cards.front, position: cards.position })
    .from(cards)
    .where(eq(cards.deckId, deckId))
    .orderBy(cards.position)
}

describe("create and read", () => {
  it("creates a deck with cards in the saved order", async () => {
    const id = await createDeckForUser(owner.id, input())
    const deck = await getDeckForEdit(id, owner.id)

    expect(deck).toMatchObject({ title: "Spanish", visibility: "private", cardCount: 3 })
    expect(deck!.cards.map((c) => c.front)).toEqual(["Hola", "Gracias", "Adiós"])
    expect((await storedCards(id)).map((c) => c.position)).toEqual([0, 1, 2])
  })

  it("lets anyone view a deck by id, but only the owner load it for editing", async () => {
    const id = await createDeckForUser(owner.id, input())

    expect(await getDeckForView(id)).toMatchObject({ id, owner: { id: owner.id } })
    expect(await getDeckForEdit(id, other.id)).toBeNull()
  })

  it("returns null for unknown or malformed ids", async () => {
    expect(await getDeckForView(randomUUID())).toBeNull()
    expect(await getDeckForView("not-a-uuid")).toBeNull()
    expect(await getDeckForEdit("not-a-uuid", owner.id)).toBeNull()
  })
})

describe("update", () => {
  it("refuses updates from a non-owner and leaves the deck unchanged", async () => {
    const id = await createDeckForUser(owner.id, input())

    const result = await updateDeckForUser(id, other.id, input({ title: "Hacked", cards: [] }))

    expect(result).toBe(false)
    const deck = await getDeckForEdit(id, owner.id)
    expect(deck).toMatchObject({ title: "Spanish", cardCount: 3 })
    expect(deck!.cards).toHaveLength(3)
  })

  it("edits, reorders, removes and adds cards while keeping ids of kept cards", async () => {
    const id = await createDeckForUser(owner.id, input())
    const [hola, gracias, adios] = (await getDeckForEdit(id, owner.id))!.cards

    const ok = await updateDeckForUser(
      id,
      owner.id,
      input({
        title: "Spanish 2",
        visibility: "public",
        cards: [
          { id: adios!.id, front: "Adiós", back: "Bye" }, // moved + edited
          { id: hola!.id, front: "Hola", back: "Hello" }, // moved
          { front: "Por favor", back: "Please" }, // new
          // "Gracias" removed
        ],
      })
    )

    expect(ok).toBe(true)
    const deck = (await getDeckForEdit(id, owner.id))!
    expect(deck).toMatchObject({ title: "Spanish 2", visibility: "public", cardCount: 3 })
    expect(deck.cards.map((c) => [c.front, c.back])).toEqual([
      ["Adiós", "Bye"],
      ["Hola", "Hello"],
      ["Por favor", "Please"],
    ])
    expect(deck.cards[0]!.id).toBe(adios!.id)
    expect(deck.cards[1]!.id).toBe(hola!.id)
    expect(deck.cards.map((c) => c.id)).not.toContain(gracias!.id)
    expect((await storedCards(id)).map((c) => c.position)).toEqual([0, 1, 2])
  })

  it("treats card ids from another deck as new cards and never touches that deck", async () => {
    const victimId = await createDeckForUser(other.id, input({ title: "Victim" }))
    const victimCard = (await getDeckForEdit(victimId, other.id))!.cards[0]!
    const id = await createDeckForUser(owner.id, input({ cards: [] }))

    await updateDeckForUser(
      id,
      owner.id,
      input({ cards: [{ id: victimCard.id, front: "Stolen?", back: "No" }] })
    )

    const deck = (await getDeckForEdit(id, owner.id))!
    expect(deck.cards).toHaveLength(1)
    expect(deck.cards[0]!.id).not.toBe(victimCard.id)
    const victim = (await getDeckForEdit(victimId, other.id))!
    expect(victim.cards[0]).toEqual(victimCard)
  })

  it("keeps only one card when the same id is sent twice", async () => {
    const id = await createDeckForUser(owner.id, input())
    const first = (await getDeckForEdit(id, owner.id))!.cards[0]!

    await updateDeckForUser(
      id,
      owner.id,
      input({ cards: [first, { ...first, front: "Duplicate" }] })
    )

    const deck = (await getDeckForEdit(id, owner.id))!
    expect(deck.cards.map((c) => c.front)).toEqual(["Hola", "Duplicate"])
    expect(deck.cards[0]!.id).toBe(first.id)
    expect(deck.cards[1]!.id).not.toBe(first.id)
  })
})

describe("visibility", () => {
  it("only lets the owner change visibility", async () => {
    const id = await createDeckForUser(owner.id, input())

    expect(await setDeckVisibilityForUser(id, other.id, "public")).toBe(false)
    expect((await getDeckForView(id))!.visibility).toBe("private")

    expect(await setDeckVisibilityForUser(id, owner.id, "public")).toBe(true)
    expect((await getDeckForView(id))!.visibility).toBe("public")

    expect(await setDeckVisibilityForUser(id, owner.id, "private")).toBe(true)
    expect((await getDeckForView(id))!.visibility).toBe("private")
  })

  it("keeps private decks viewable by link", async () => {
    const id = await createDeckForUser(owner.id, input({ visibility: "private" }))
    expect(await getDeckForView(id)).toMatchObject({ id, visibility: "private" })
  })

  it("returns false for malformed ids", async () => {
    expect(await setDeckVisibilityForUser("nope", owner.id, "public")).toBe(false)
  })
})

describe("delete", () => {
  it("only lets the owner delete, and removes the cards", async () => {
    const id = await createDeckForUser(owner.id, input())

    expect(await deleteDeckForUser(id, other.id)).toBe(false)
    expect(await getDeckForView(id)).not.toBeNull()

    expect(await deleteDeckForUser(id, owner.id)).toBe(true)
    expect(await getDeckForView(id)).toBeNull()
    expect(await storedCards(id)).toHaveLength(0)
    expect(await db.select().from(decks).where(eq(decks.id, id))).toHaveLength(0)
  })
})
