"use server"

import { z } from "zod"

import { setCardRetiredForUser, unretireAllForUser } from "@/server/retirements"
import { requireUser } from "@/server/session"

// Public endpoints: re-check the session and validate every argument.

type Result = { ok: true } | { ok: false; error: string }

const retireInput = z.object({
  deckId: z.uuid(),
  cardId: z.uuid(),
  retired: z.boolean(),
})

export async function setCardRetired(
  deckId: string,
  cardId: string,
  retired: boolean
): Promise<Result> {
  const user = await requireUser(`/decks/${deckId}`)
  const parsed = retireInput.safeParse({ deckId, cardId, retired })
  if (!parsed.success) return { ok: false, error: "Invalid request." }

  const updated = await setCardRetiredForUser(user.id, deckId, cardId, retired)
  return updated ? { ok: true } : { ok: false, error: "This card no longer exists." }
}

export async function unretireAll(deckId: string): Promise<Result> {
  const user = await requireUser(`/decks/${deckId}`)
  if (!z.uuid().safeParse(deckId).success) return { ok: false, error: "Invalid request." }

  await unretireAllForUser(user.id, deckId)
  return { ok: true }
}
