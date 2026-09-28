"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { deckInput, formatIssues } from "@/lib/validation"
import {
  createDeckForUser,
  deleteDeckForUser,
  updateDeckForUser,
} from "@/server/decks"
import { requireUser } from "@/server/session"

// Server Actions are public HTTP endpoints: never trust the payload. Each one
// re-checks the session, re-validates input and relies on the owner-scoped
// queries in server/decks.ts.

export type ActionResult = { ok: false; errors: string[] }

export async function createDeck(payload: unknown): Promise<ActionResult> {
  const user = await requireUser("/decks/new")
  const parsed = deckInput.safeParse(payload)
  if (!parsed.success) return { ok: false, errors: formatIssues(parsed.error) }

  const id = await createDeckForUser(user.id, parsed.data)
  revalidatePath("/decks")
  redirect(`/decks/${id}`)
}

export async function updateDeck(
  id: string,
  payload: unknown
): Promise<ActionResult> {
  const user = await requireUser(`/decks/${id}/edit`)
  const parsed = deckInput.safeParse(payload)
  if (!parsed.success) return { ok: false, errors: formatIssues(parsed.error) }

  const updated = await updateDeckForUser(id, user.id, parsed.data)
  if (!updated) {
    return { ok: false, errors: ["This deck doesn't exist or isn't yours."] }
  }
  revalidatePath("/decks")
  revalidatePath(`/decks/${id}`)
  redirect(`/decks/${id}`)
}

export async function deleteDeck(id: string): Promise<ActionResult> {
  const user = await requireUser()
  const deleted = await deleteDeckForUser(id, user.id)
  if (!deleted) {
    return { ok: false, errors: ["This deck doesn't exist or isn't yours."] }
  }
  revalidatePath("/decks")
  redirect("/decks?scope=mine")
}
