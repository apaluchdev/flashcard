import {
  LIMITS,
  deckImportFile,
  formatIssues,
  type DeckImportFile,
  type Visibility,
} from "@/lib/validation"

// The .json deck format (docs/PLAN.md §5), shared by import and export so
// an exported file always imports back.

export const DECK_FILE_VERSION = 1

export type DeckFile = {
  version: typeof DECK_FILE_VERSION
  title: string
  description?: string
  visibility?: Visibility
  cards: { front: string; back: string }[]
}

export type ParseResult =
  | { ok: true; deck: DeckImportFile }
  | { ok: false; errors: string[] }

const MAX_REPORTED_ERRORS = 20

/** Parses and validates the text of an uploaded deck file. */
export function parseDeckFile(text: string): ParseResult {
  // Some Windows editors save UTF-8 with a byte-order mark, which JSON.parse rejects.
  const source = text.replace(/^﻿/, "").trim()
  if (!source) return { ok: false, errors: ["The file is empty."] }

  let json: unknown
  try {
    json = JSON.parse(source)
  } catch (error) {
    const detail = error instanceof SyntaxError ? ` (${error.message})` : ""
    return { ok: false, errors: [`The file isn't valid JSON${detail}.`] }
  }

  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    return {
      ok: false,
      errors: ['The file must contain a JSON object with "title" and "cards".'],
    }
  }

  const parsed = deckImportFile.safeParse(json)
  if (!parsed.success) {
    const errors = formatIssues(parsed.error)
    if (errors.length > MAX_REPORTED_ERRORS) {
      const more = errors.length - MAX_REPORTED_ERRORS
      return {
        ok: false,
        errors: [...errors.slice(0, MAX_REPORTED_ERRORS), `…and ${more} more.`],
      }
    }
    return { ok: false, errors }
  }
  return { ok: true, deck: parsed.data }
}

/** Checks the file itself before reading it. Returns an error message or null. */
export function checkDeckFile(file: { name: string; size: number; type: string }) {
  const isJson = file.name.toLowerCase().endsWith(".json") || file.type === "application/json"
  if (!isJson) return "Choose a .json file."
  if (file.size > LIMITS.importFileBytes) {
    const mb = (LIMITS.importFileBytes / 1024 / 1024).toFixed(0)
    return `The file is too large (max ${mb} MB).`
  }
  return null
}

/**
 * Serializes a deck to the import format. `visibility` is included only
 * when given (the owner's export), so re-imported copies default to private.
 */
export function toDeckFile(deck: {
  title: string
  description: string | null
  visibility?: Visibility
  cards: { front: string; back: string }[]
}): DeckFile {
  return {
    version: DECK_FILE_VERSION,
    title: deck.title,
    ...(deck.description ? { description: deck.description } : {}),
    ...(deck.visibility ? { visibility: deck.visibility } : {}),
    cards: deck.cards.map(({ front, back }) => ({ front, back })),
  }
}

/** A safe download name, e.g. "Spanish Basics!" → "spanish-basics.json". */
export function deckFileName(title: string) {
  const slug = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "")
  return `${slug || "deck"}.json`
}
