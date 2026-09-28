import type { Metadata } from "next"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

import { VisibilityBadge } from "@/components/visibility-badge"
import { buttonVariants } from "@/components/ui/button"
import { listDecksForUser } from "@/server/decks"
import { getCurrentUser } from "@/server/session"

export const metadata: Metadata = { title: "Decks" }

// Interim page: lists the signed-in user's decks. Phase 7 replaces it with
// search across "My decks" and "Public decks".
export default async function DecksPage() {
  const user = await getCurrentUser()
  const decks = user ? await listDecksForUser(user.id) : []

  return (
    <div className="container mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">My decks</h1>
        {user && (
          <Link href="/decks/new" className={buttonVariants()}>
            <PlusIcon />
            New deck
          </Link>
        )}
      </div>

      {!user ? (
        <p className="text-muted-foreground">
          <Link href="/sign-in?next=/decks" className="underline underline-offset-4">
            Sign in
          </Link>{" "}
          to see your decks. Public deck search is coming soon.
        </p>
      ) : decks.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-10 text-center text-muted-foreground">
          <p>You haven&apos;t created any decks yet.</p>
          <Link href="/decks/new" className={buttonVariants()}>
            Create your first deck
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <li key={deck.id}>
              <Link
                href={`/decks/${deck.id}`}
                className="flex h-full flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <span className="font-medium break-words">{deck.title}</span>
                {deck.description && (
                  <span className="line-clamp-2 text-sm text-muted-foreground">
                    {deck.description}
                  </span>
                )}
                <span className="mt-auto flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                  {deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"}
                  <VisibilityBadge visibility={deck.visibility} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
