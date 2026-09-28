import type { Metadata } from "next"

import { DeckForm } from "@/components/deck-form"
import { requireUser } from "@/server/session"

export const metadata: Metadata = { title: "New deck" }

export default async function NewDeckPage() {
  await requireUser("/decks/new")

  return (
    <div className="container mx-auto w-full max-w-3xl px-4 pt-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">New deck</h1>
      {/* Phase 6 adds an "Import JSON" tab next to this form. */}
      <DeckForm mode="create" />
    </div>
  )
}
