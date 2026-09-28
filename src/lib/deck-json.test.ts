import { describe, expect, it } from "vitest"

import exampleDeck from "../../public/deck-example.json"
import { checkDeckFile, deckFileName, parseDeckFile, toDeckFile } from "./deck-json"
import { LIMITS } from "./validation"

const valid = {
  title: "Spanish Basics",
  description: "Common greetings",
  visibility: "public",
  cards: [
    { front: "Hola", back: "Hello" },
    { front: "Gracias", back: "Thank you" },
  ],
}

function errorsOf(text: string) {
  const result = parseDeckFile(text)
  expect(result.ok).toBe(false)
  return result.ok ? [] : result.errors
}

describe("parseDeckFile", () => {
  it("accepts a valid deck", () => {
    const result = parseDeckFile(JSON.stringify(valid))
    expect(result).toEqual({ ok: true, deck: valid })
  })

  it("accepts the published example file", () => {
    expect(parseDeckFile(JSON.stringify(exampleDeck)).ok).toBe(true)
  })

  it("strips a UTF-8 byte-order mark", () => {
    expect(parseDeckFile(`﻿${JSON.stringify(valid)}`).ok).toBe(true)
  })

  it("explains empty files, invalid JSON and wrong top-level shapes", () => {
    expect(errorsOf("   ")).toEqual(["The file is empty."])
    expect(errorsOf("{ title: nope }")[0]).toMatch(/^The file isn't valid JSON/)
    const shape = ['The file must contain a JSON object with "title" and "cards".']
    expect(errorsOf("[1, 2]")).toEqual(shape)
    expect(errorsOf('"just a string"')).toEqual(shape)
    expect(errorsOf("null")).toEqual(shape)
  })

  it("reports schema problems with paths", () => {
    expect(errorsOf(JSON.stringify({ title: "T", cards: [{ front: "Q" }] }))).toEqual([
      "cards[0].back: Back is required",
    ])
  })

  it("caps the number of reported errors", () => {
    const cards = Array.from({ length: 30 }, () => ({ front: "" , back: "" }))
    const errors = errorsOf(JSON.stringify({ title: "T", cards }))
    expect(errors).toHaveLength(21)
    expect(errors.at(-1)).toBe("…and 40 more.")
  })
})

describe("toDeckFile", () => {
  it("round-trips through parseDeckFile", () => {
    const file = toDeckFile({ ...valid, visibility: "public" })
    const result = parseDeckFile(JSON.stringify(file, null, 2))
    expect(result).toEqual({ ok: true, deck: valid })
  })

  it("includes a version and omits visibility and empty descriptions when not given", () => {
    const file = toDeckFile({ title: "T", description: null, cards: valid.cards })
    expect(file).toEqual({ version: 1, title: "T", cards: valid.cards })
    const reimported = parseDeckFile(JSON.stringify(file))
    expect(reimported.ok && reimported.deck.visibility).toBe("private")
  })

  it("drops card ids and other extra fields", () => {
    const file = toDeckFile({
      title: "T",
      description: null,
      cards: [{ id: "x", front: "Q", back: "A" } as { front: string; back: string }],
    })
    expect(file.cards).toEqual([{ front: "Q", back: "A" }])
  })
})

describe("checkDeckFile", () => {
  it("accepts .json files within the size limit", () => {
    expect(checkDeckFile({ name: "deck.JSON", size: 10, type: "" })).toBeNull()
    expect(checkDeckFile({ name: "deck", size: 10, type: "application/json" })).toBeNull()
  })

  it("rejects other file types and oversized files", () => {
    expect(checkDeckFile({ name: "deck.csv", size: 10, type: "text/csv" })).toBe("Choose a .json file.")
    expect(
      checkDeckFile({ name: "deck.json", size: LIMITS.importFileBytes + 1, type: "" })
    ).toBe("The file is too large (max 1 MB).")
  })
})

describe("deckFileName", () => {
  it("builds a safe, readable file name", () => {
    expect(deckFileName("Spanish Basics!")).toBe("spanish-basics.json")
    expect(deckFileName("Adiós & Café")).toBe("adios-cafe.json")
    expect(deckFileName("../../etc/passwd")).toBe("etc-passwd.json")
    expect(deckFileName("日本語")).toBe("deck.json")
    expect(deckFileName("a".repeat(100))).toBe(`${"a".repeat(60)}.json`)
  })
})
