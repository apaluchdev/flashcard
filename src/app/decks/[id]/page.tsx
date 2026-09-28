import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"
import { ChevronDownIcon, PencilIcon, PlusIcon } from "lucide-react"

import { CardViewer } from "@/components/card-viewer"
import { ShareButton } from "@/components/share-button"
import { VisibilityBadge } from "@/components/visibility-badge"
import { VisibilityMenu } from "@/components/visibility-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { getDeckForView } from "@/server/decks"
import { getCurrentUser } from "@/server/session"

// One query per request, shared by generateMetadata and the page.
const getDeck = cache(getDeckForView)

export async function generateMetadata({
  params,
}: PageProps<"/decks/[id]">): Promise<Metadata> {
  const deck = await getDeck((await params).id)
  if (!deck) return { title: "Deck not found" }

  const cardsText = `${deck.cardCount} ${deck.cardCount === 1 ? "card" : "cards"}`
  const description = deck.description
    ? deck.description.slice(0, 200)
    : `A flashcard deck with ${cardsText} by ${deck.owner.name}.`

  return {
    title: deck.title,
    description,
    openGraph: { title: deck.title, description, type: "website", url: `/decks/${deck.id}` },
    twitter: { card: "summary_large_image", title: deck.title, description },
    // Private decks are unlisted: shareable by link, but kept out of search engines.
    robots: deck.visibility === "private" ? { index: false, follow: false } : undefined,
  }
}

export default async function DeckPage({ params }: PageProps<"/decks/[id]">) {
  const { id } = await params
  const [deck, user] = await Promise.all([getDeck(id), getCurrentUser()])
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
          <div className="flex gap-2">
            <ShareButton deckId={deck.id} title={deck.title} visibility={deck.visibility} />
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
          {isOwner ? (
            <VisibilityMenu deckId={deck.id} visibility={deck.visibility} />
          ) : (
            <VisibilityBadge visibility={deck.visibility} />
          )}
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
        <>
          <CardViewer cards={deck.cards} />

          <details className="group mt-10 rounded-lg border">
            <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-medium [&::-webkit-details-marker]:hidden">
              All cards ({deck.cards.length})
              <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <ol className="flex flex-col divide-y border-t">
              {deck.cards.map((card, index) => (
                <li key={card.id} className="grid gap-2 p-4 sm:grid-cols-2">
                  <p className="whitespace-pre-line break-words">
                    <span className="sr-only">Card {index + 1} question: </span>
                    {card.front}
                  </p>
                  <p className="whitespace-pre-line break-words text-muted-foreground">
                    <span className="sr-only">Answer: </span>
                    {card.back}
                  </p>
                </li>
              ))}
            </ol>
          </details>
        </>
      )}
    </div>
  )
}
