import { z } from "zod"

// Shared by in-app forms (client + Server Actions) and JSON import, so the
// same rules apply no matter how a deck is created.

export const LIMITS = {
  title: 200,
  description: 2000,
  cardText: 5000,
  cardsPerDeck: 1000,
  importFileBytes: 1024 * 1024,
} as const

export const VISIBILITIES = ["private", "public"] as const
export type Visibility = (typeof VISIBILITIES)[number]

const requiredText = (label: string, max: number) =>
  z
    .string({ error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max.toLocaleString("en-US")} characters`)

export const visibilitySchema = z.enum(VISIBILITIES, {
  error: `Visibility must be "private" or "public"`,
})

const deckFields = {
  title: requiredText("Title", LIMITS.title),
  // Blank descriptions are stored as null.
  description: z
    .string()
    .trim()
    .max(
      LIMITS.description,
      `Description must be at most ${LIMITS.description.toLocaleString("en-US")} characters`
    )
    .nullish()
    .transform((value) => value || null),
  visibility: visibilitySchema.default("private"),
}

const cardFields = {
  front: requiredText("Front", LIMITS.cardText),
  back: requiredText("Back", LIMITS.cardText),
}

const tooManyCards = `A deck can have at most ${LIMITS.cardsPerDeck.toLocaleString("en-US")} cards`

/** A card in the in-app editor. `id` is present for cards that already exist. */
export const cardInput = z.object({
  id: z.uuid().optional(),
  ...cardFields,
})

/** Create/update payload from the in-app editor. A deck may start empty. */
export const deckInput = z.object({
  ...deckFields,
  cards: z.array(cardInput).max(LIMITS.cardsPerDeck, tooManyCards),
})

/**
 * Shape of an uploaded .json deck (see docs/PLAN.md §5). Unknown keys are
 * stripped, so files with extra fields still import.
 */
export const deckImportFile = z.object({
  ...deckFields,
  cards: z
    .array(z.object(cardFields), { error: "Cards must be a list" })
    .min(1, "A deck needs at least one card")
    .max(LIMITS.cardsPerDeck, tooManyCards),
})

export type CardInput = z.infer<typeof cardInput>
export type DeckInput = z.infer<typeof deckInput>
export type DeckImportFile = z.infer<typeof deckImportFile>

/** Flattens zod issues to "cards[3].back: Back is required" strings. */
export function formatIssues(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.reduce<string>(
      (acc, key) =>
        typeof key === "number" ? `${acc}[${key}]` : acc ? `${acc}.${String(key)}` : String(key),
      ""
    )
    return path ? `${path}: ${issue.message}` : issue.message
  })
}
