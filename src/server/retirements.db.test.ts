import { randomUUID } from "node:crypto"

import { inArray } from "drizzle-orm"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { db } from "@/db"
import { user } from "@/db/schema"
import { deckInput } from "@/lib/validation"

import { createDeckForUser, getDeckForEdit, updateDeckForUser, deleteDeckForUser } from "./decks"
import { getRetiredCardIds, setCardRetiredForUser, unretireAllForUser } from "./retirements"

const owner = { id: `test-owner-${randomUUID()}`, name: "Owner" }
const learner = { id: `test-learner-${randomUUID()}`, name: "Learner" }

let deckId: string
let otherDeckId: string
let cardIds: string[]

beforeAll(async () => {
  await db.insert(user).values([owner, learner].map((u) => ({ ...u, email: `${u.id}@example.test` })))
  deckId = await createDeckForUser(
    owner.id,
    deckInput.parse({
      title: "Retire test",
      cards: [
        { front: "Q1", back: "A1" },
        { front: "Q2", back: "A2" },
        { front: "Q3", back: "A3" },
      ],
    })
  )
  otherDeckId = await createDeckForUser(
    owner.id,
    deckInput.parse({ title: "Other", cards: [{ front: "X", back: "Y" }] })
  )
  cardIds = (await getDeckForEdit(deckId, owner.id))!.cards.map((c) => c.id)
})

afterAll(async () => {
  await db.delete(user).where(inArray(user.id, [owner.id, learner.id]))
})

describe("card retirements", () => {
  it("retires and unretires cards per user, idempotently", async () => {
    expect(await setCardRetiredForUser(learner.id, deckId, cardIds[0]!, true)).toBe(true)
    expect(await setCardRetiredForUser(learner.id, deckId, cardIds[0]!, true)).toBe(true)
    expect(await getRetiredCardIds(learner.id, deckId)).toEqual([cardIds[0]])

    // Another user's progress is separate, and non-owners can retire too.
    expect(await getRetiredCardIds(owner.id, deckId)).toEqual([])

    expect(await setCardRetiredForUser(learner.id, deckId, cardIds[0]!, false)).toBe(true)
    expect(await setCardRetiredForUser(learner.id, deckId, cardIds[0]!, false)).toBe(true)
    expect(await getRetiredCardIds(learner.id, deckId)).toEqual([])
  })

  it("rejects cards that don't belong to the deck and malformed ids", async () => {
    expect(await setCardRetiredForUser(learner.id, otherDeckId, cardIds[0]!, true)).toBe(false)
    expect(await setCardRetiredForUser(learner.id, deckId, randomUUID(), true)).toBe(false)
    expect(await setCardRetiredForUser(learner.id, "nope", cardIds[0]!, true)).toBe(false)
    expect(await getRetiredCardIds(learner.id, otherDeckId)).toEqual([])
  })

  it("survives deck edits that keep the card, and disappears when the card is removed", async () => {
    await setCardRetiredForUser(learner.id, deckId, cardIds[1]!, true)
    await setCardRetiredForUser(learner.id, deckId, cardIds[2]!, true)
    const [c1, c2] = (await getDeckForEdit(deckId, owner.id))!.cards

    // Owner reorders/edits card 2 and removes card 3.
    await updateDeckForUser(
      deckId,
      owner.id,
      deckInput.parse({
        title: "Retire test",
        cards: [
          { id: c2!.id, front: "Q2 edited", back: "A2" },
          { id: c1!.id, front: "Q1", back: "A1" },
        ],
      })
    )

    expect(await getRetiredCardIds(learner.id, deckId)).toEqual([cardIds[1]])
  })

  it("unretires everything in one deck only", async () => {
    await setCardRetiredForUser(learner.id, deckId, cardIds[0]!, true)
    const [otherCard] = (await getDeckForEdit(otherDeckId, owner.id))!.cards
    await setCardRetiredForUser(learner.id, otherDeckId, otherCard!.id, true)

    expect(await unretireAllForUser(learner.id, deckId)).toBe(2)
    expect(await getRetiredCardIds(learner.id, deckId)).toEqual([])
    expect(await getRetiredCardIds(learner.id, otherDeckId)).toEqual([otherCard!.id])
  })

  it("is removed when the deck is deleted", async () => {
    await deleteDeckForUser(otherDeckId, owner.id)
    expect(await getRetiredCardIds(learner.id, otherDeckId)).toEqual([])
  })
})
