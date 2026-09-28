import { describe, expect, it } from "vitest"

import {
  LIMITS,
  deckImportFile,
  deckInput,
  formatIssues,
} from "./validation"

const card = (i = 0) => ({ front: `Q${i}`, back: `A${i}` })
const cardsOf = (n: number) => Array.from({ length: n }, (_, i) => card(i))

function issues(result: { success: boolean; error?: unknown }) {
  expect(result.success).toBe(false)
  return formatIssues(result.error as Parameters<typeof formatIssues>[0])
}

describe("deckInput", () => {
  it("accepts a minimal deck and applies defaults", () => {
    const result = deckInput.parse({ title: "  Spanish  ", cards: [] })
    expect(result).toEqual({
      title: "Spanish",
      description: null,
      visibility: "private",
      cards: [],
    })
  })

  it("stores blank descriptions as null and trims card text", () => {
    const result = deckInput.parse({
      title: "T",
      description: "   ",
      cards: [{ front: " Hola ", back: "Hello\nHi" }],
    })
    expect(result.description).toBeNull()
    expect(result.cards[0]).toEqual({ front: "Hola", back: "Hello\nHi" })
  })

  it("keeps existing card ids and rejects malformed ones", () => {
    const id = "0b9a0c5e-3f4a-4d6b-9a8e-2c1d3e4f5a6b"
    expect(deckInput.parse({ title: "T", cards: [{ id, ...card() }] }).cards[0]!.id).toBe(id)
    expect(
      issues(deckInput.safeParse({ title: "T", cards: [{ id: "nope", ...card() }] }))[0]
    ).toMatch(/^cards\[0\]\.id:/)
  })

  it("enforces length limits", () => {
    expect(
      issues(deckInput.safeParse({ title: "x".repeat(LIMITS.title + 1), cards: [] }))
    ).toEqual(["title: Title must be at most 200 characters"])
    expect(
      issues(
        deckInput.safeParse({
          title: "T",
          cards: [{ front: "x".repeat(LIMITS.cardText + 1), back: "b" }],
        })
      )
    ).toEqual(["cards[0].front: Front must be at most 5,000 characters"])
  })

  it("rejects blank titles and card sides", () => {
    expect(
      issues(deckInput.safeParse({ title: "   ", cards: [{ front: "", back: " " }] }))
    ).toEqual([
      "title: Title is required",
      "cards[0].front: Front is required",
      "cards[0].back: Back is required",
    ])
  })

  it("caps the number of cards", () => {
    expect(deckInput.safeParse({ title: "T", cards: cardsOf(LIMITS.cardsPerDeck) }).success).toBe(true)
    expect(
      issues(deckInput.safeParse({ title: "T", cards: cardsOf(LIMITS.cardsPerDeck + 1) }))
    ).toEqual(["cards: A deck can have at most 1,000 cards"])
  })

  it("rejects unknown visibility values", () => {
    expect(
      issues(deckInput.safeParse({ title: "T", visibility: "secret", cards: [] }))
    ).toEqual([`visibility: Visibility must be "private" or "public"`])
  })
})

describe("deckImportFile", () => {
  it("accepts the documented example", () => {
    const result = deckImportFile.parse({
      title: "Spanish Basics",
      description: "Common greetings and phrases",
      visibility: "public",
      cards: [card(1), card(2)],
    })
    expect(result.visibility).toBe("public")
    expect(result.cards).toHaveLength(2)
  })

  it("ignores unknown fields at every level", () => {
    const result = deckImportFile.parse({
      title: "T",
      author: "someone",
      cards: [{ ...card(), hint: "extra", id: "not-used" }],
    })
    expect(result).not.toHaveProperty("author")
    expect(result.cards[0]).toEqual(card())
  })

  it("requires a title and at least one card", () => {
    expect(issues(deckImportFile.safeParse({ cards: [] }))).toEqual([
      "title: Title is required",
      "cards: A deck needs at least one card",
    ])
  })

  it("reports wrong types with paths", () => {
    expect(issues(deckImportFile.safeParse({ title: "T", cards: "nope" }))).toEqual([
      "cards: Cards must be a list",
    ])
    expect(
      issues(deckImportFile.safeParse({ title: "T", cards: [card(), { front: "Q" }] }))
    ).toEqual(["cards[1].back: Back is required"])
  })

  it("caps the number of cards", () => {
    expect(
      issues(deckImportFile.safeParse({ title: "T", cards: cardsOf(LIMITS.cardsPerDeck + 1) }))
    ).toEqual(["cards: A deck can have at most 1,000 cards"])
  })
})
