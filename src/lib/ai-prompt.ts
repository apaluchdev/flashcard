import { DECK_FILE_VERSION, type DeckFile } from "@/lib/deck-json"
import { LIMITS } from "@/lib/validation"

// A copyable prompt that tells an AI assistant exactly how to write a deck
// file this app can import. Built from LIMITS so it never drifts from the
// validation rules.

export const DEFAULT_AI_CARD_COUNT = 20

export const AI_PROMPT_EXAMPLE: DeckFile = {
  version: DECK_FILE_VERSION,
  title: "Photosynthesis Basics",
  description: "Key terms and steps of photosynthesis for an intro biology course.",
  visibility: "private",
  cards: [
    {
      front: "What is photosynthesis?",
      back: "The process plants, algae and some bacteria use to turn light energy, water and carbon dioxide into glucose and oxygen.",
    },
    {
      front: "Where in the plant cell does photosynthesis take place?",
      back: "In the chloroplasts.",
    },
    {
      front: "What are the two main stages of photosynthesis?",
      back: "1. Light-dependent reactions (in the thylakoid membranes)\n2. The Calvin cycle (in the stroma)",
    },
  ],
}

const n = (value: number) => value.toLocaleString("en-US")

export function clampCardCount(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_AI_CARD_COUNT
  return Math.min(Math.max(Math.round(value), 1), LIMITS.cardsPerDeck)
}

export function buildDeckPrompt({
  topic = "",
  cardCount = DEFAULT_AI_CARD_COUNT,
}: { topic?: string; cardCount?: number } = {}) {
  const count = clampCardCount(cardCount)
  const subject = topic.trim() || "[DESCRIBE THE TOPIC, LEVEL AND ANY SOURCE MATERIAL HERE]"
  const maxMb = LIMITS.importFileBytes / 1024 / 1024

  return `You are creating a flashcard deck that will be imported into a flashcard app as a JSON file.

## Task
Create a deck of exactly ${n(count)} flashcards about:
${subject}

## Output format
- Reply with ONLY the JSON object: no explanation before or after it, no Markdown code fences, no comments. Your entire reply will be saved as a .json file.
- The JSON must be valid: double quotes around all keys and string values, no trailing commas, no comments, and UTF-8 text.
- Inside strings, escape double quotes as \\" and backslashes as \\\\. Write line breaks as \\n (never a raw line break inside a string).

## JSON structure
The top level is a single object (not an array) with these fields:

| Field | Type | Required | Rules |
|---|---|---|---|
| "version" | number | no | Always ${DECK_FILE_VERSION}. |
| "title" | string | yes | 1–${n(LIMITS.title)} characters. The deck's name. |
| "description" | string | no | Up to ${n(LIMITS.description)} characters. One or two sentences about what the deck covers. |
| "visibility" | string | no | "private" or "public". Use "private" unless told otherwise. |
| "cards" | array | yes | 1–${n(LIMITS.cardsPerDeck)} card objects, in the order they should be studied. |

Each card object has exactly two fields:

| Field | Type | Required | Rules |
|---|---|---|---|
| "front" | string | yes | 1–${n(LIMITS.cardText)} characters. The question or prompt. |
| "back" | string | yes | 1–${n(LIMITS.cardText)} characters. The answer. |

Other rules the importer enforces:
- Text is trimmed; a title, front or back that is empty or only whitespace is rejected.
- Card text is shown as plain text with line breaks preserved. Markdown, HTML and LaTeX are NOT rendered, so don't use them (no **bold**, no <b>, no $x^2$). Use plain characters instead (for example x², →, •, or "1." lists on separate lines).
- The whole file must be under ${n(maxMb)} MB.
- Any other fields are ignored, so don't add ids, tags, hints or metadata.

## Writing good cards
- One idea per card. Split anything with several independent facts into several cards.
- The front must make sense on its own and have one clear answer. Prefer specific questions ("What does ATP stand for?") over vague ones ("ATP?").
- Keep the back short: ideally one sentence or a short list. Put only the answer there, without repeating the question.
- Don't start text with labels like "Q:", "A:", "Front:" or "Back:".
- No duplicate or near-duplicate cards.
- Order cards from foundational to advanced, grouping related cards together.
- Be factually accurate. If the topic includes source material, base the cards only on it.

## Example of a valid file
${JSON.stringify(AI_PROMPT_EXAMPLE, null, 2)}

## Before you reply, check that
- the reply is one JSON object and nothing else;
- "title" is present and at most ${n(LIMITS.title)} characters;
- "cards" contains exactly ${n(count)} objects, each with a non-empty "front" and "back" of at most ${n(LIMITS.cardText)} characters;
- the JSON parses without errors.`
}
