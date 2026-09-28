import { describe, expect, it } from "vitest"

import {
  AI_PROMPT_EXAMPLE,
  DEFAULT_AI_CARD_COUNT,
  buildDeckPrompt,
  clampCardCount,
} from "./ai-prompt"
import { parseDeckFile } from "./deck-json"
import { LIMITS } from "./validation"

describe("buildDeckPrompt", () => {
  it("states every limit the importer enforces", () => {
    const prompt = buildDeckPrompt()
    expect(prompt).toContain(`1–${LIMITS.title} characters`)
    expect(prompt).toContain(`Up to ${LIMITS.description.toLocaleString("en-US")} characters`)
    expect(prompt).toContain(`1–${LIMITS.cardText.toLocaleString("en-US")} characters`)
    expect(prompt).toContain(`1–${LIMITS.cardsPerDeck.toLocaleString("en-US")} card objects`)
    expect(prompt).toContain("under 1 MB")
    expect(prompt).toContain(`"private" or "public"`)
  })

  it("includes an example that the importer accepts", () => {
    const result = parseDeckFile(JSON.stringify(AI_PROMPT_EXAMPLE))
    expect(result.ok).toBe(true)
    expect(buildDeckPrompt()).toContain(JSON.stringify(AI_PROMPT_EXAMPLE, null, 2))
  })

  it("fills in the topic and card count", () => {
    const prompt = buildDeckPrompt({ topic: "  Spanish travel phrases  ", cardCount: 35 })
    expect(prompt).toContain("exactly 35 flashcards about:\nSpanish travel phrases\n")
    expect(prompt).toContain(`"cards" contains exactly 35 objects`)
  })

  it("uses a placeholder when no topic is given", () => {
    expect(buildDeckPrompt({ topic: "   " })).toContain("[DESCRIBE THE TOPIC")
  })

  it("keeps JSON escaping instructions intact", () => {
    const prompt = buildDeckPrompt()
    expect(prompt).toContain(String.raw`escape double quotes as \" and backslashes as \\`)
    expect(prompt).toContain(String.raw`Write line breaks as \n`)
  })
})

describe("clampCardCount", () => {
  it("keeps the count within 1..cardsPerDeck", () => {
    expect(clampCardCount(0)).toBe(1)
    expect(clampCardCount(-5)).toBe(1)
    expect(clampCardCount(12.6)).toBe(13)
    expect(clampCardCount(LIMITS.cardsPerDeck + 50)).toBe(LIMITS.cardsPerDeck)
    expect(clampCardCount(Number.NaN)).toBe(DEFAULT_AI_CARD_COUNT)
  })
})
