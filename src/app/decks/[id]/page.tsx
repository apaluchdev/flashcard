import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PencilIcon, PlusIcon } from "lucide-react"

import { VisibilityBadge } from "@/components/visibility-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { getDeckForView } from "@/server/decks"
import { getCurrentUser } from "@/server/session"

export const metadata: Metadata = { title: "Deck" }

export default async function DeckPage({ params }: PageProps<"/decks/[id]">) {
  const { id } = await params
  const [deck, user] = await Promise.all([getDeckForView(id), getCurrentUser()])
  if (!deck) notFound()

  const isOwner = user?.id === deck.owner.id

  return (
    <div className="container mx-auto w-full max-w-3xl px-4 py-8">
      <header className="mb-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight break-words">
              {deck.title}
            </h1>
            {deck.description && (
              <p className="whitespace-pre-line text-muted-foreground">
                {deck.description}
              </p>
            )}
          </div>
          {isOwner && (
            <Link
              href={`/decks/${deck.id}/edit`}
              className={buttonVariants({ variant: "outline" })}
            >
              <PencilIcon />
              Edit
            </Link>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Avatar size="sm">
              {deck.owner.image && <AvatarImage src={deck.owner.image} alt="" />}
              <AvatarFallback>{deck.owner.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            {deck.owner.name}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"}
          </span>
          <VisibilityBadge visibility={deck.visibility} />
        </div>
      </header>

      {deck.cards.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          <p>This deck has no cards yet.</p>
          {isOwner && (
            <Link href={`/decks/${deck.id}/edit`} className={buttonVariants()}>
              <PlusIcon />
              Add cards
            </Link>
          )}
        </div>
      ) : (
        // Phase 4 replaces this list with the flip-card study viewer.
        <ol className="flex flex-col gap-3">
          {deck.cards.map((card, index) => (
            <li key={card.id} className="grid gap-2 rounded-lg border p-4 sm:grid-cols-2">
              <p className="whitespace-pre-line">
                <span className="sr-only">Card {index + 1} front: </span>
                {card.front}
              </p>
              <p className="whitespace-pre-line text-muted-foreground">
                <span className="sr-only">Back: </span>
                {card.back}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
