import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DeckForm } from "@/components/deck-form"
import { DeleteDeckButton } from "@/components/delete-deck-button"
import { getDeckForEdit } from "@/server/decks"
import { requireUser } from "@/server/session"

export const metadata: Metadata = {
  title: "Edit deck",
  robots: { index: false, follow: false },
}

export default async function EditDeckPage({
  params,
}: PageProps<"/decks/[id]/edit">) {
  const { id } = await params
  const user = await requireUser(`/decks/${id}/edit`)

  // Non-owners get the same 404 as a missing deck.
  const deck = await getDeckForEdit(id, user.id)
  if (!deck) notFound()

  return (
    <div className="container mx-auto w-full max-w-3xl px-4 pt-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Edit deck</h1>
        <DeleteDeckButton deckId={deck.id} title={deck.title} />
      </div>
      <DeckForm
        mode="edit"
        deckId={deck.id}
        initial={{
          title: deck.title,
          description: deck.description,
          visibility: deck.visibility,
          cards: deck.cards,
        }}
      />
    </div>
  )
}
