import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { DeckGrid, DeckTile } from "@/components/deck-tile"
import { buttonVariants } from "@/components/ui/button"
import { searchDecks } from "@/server/decks"

const RECENT_COUNT = 6

export default async function Home() {
  const { decks: recent } = await searchDecks({ scope: "public", pageSize: RECENT_COUNT })

  return (
    <div className="container mx-auto flex w-full max-w-5xl flex-1 flex-col px-4">
      <section className="flex flex-col items-center gap-6 py-20 text-center sm:py-24">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Study smarter with flashcards
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground text-balance">
          Build decks in the app or import them from JSON, study one card at a
          time, and share them with a link.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/decks/new" className={buttonVariants({ size: "lg" })}>
            Create a deck
          </Link>
          <Link href="/decks" className={buttonVariants({ size: "lg", variant: "outline" })}>
            Browse decks
          </Link>
        </div>
      </section>

      {recent.length > 0 && (
        <section aria-labelledby="recent-heading" className="pb-16">
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 id="recent-heading" className="text-lg font-semibold">
              Recently updated public decks
            </h2>
            <Link
              href="/decks"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              See all
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <DeckGrid>
            {recent.map((deck) => (
              <li key={deck.id}>
                <DeckTile deck={deck} show="owner" />
              </li>
            ))}
          </DeckGrid>
        </section>
      )}
    </div>
  )
}
