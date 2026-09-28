import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react"

import { DeckSearch } from "@/components/deck-search"
import { DeckGrid, DeckTile } from "@/components/deck-tile"
import { buttonVariants } from "@/components/ui/button"
import { SEARCH_MAX_QUERY, searchDecks, type SearchScope } from "@/server/decks"
import { getCurrentUser } from "@/server/session"
import { cn } from "cn"

export const metadata: Metadata = { title: "Browse decks" }

const MAX_PAGE = 1000

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function DecksPage({ searchParams }: PageProps<"/decks">) {
  const params = await searchParams
  const scope: SearchScope = first(params.scope) === "mine" ? "mine" : "public"
  const query = (first(params.q) ?? "").trim().slice(0, SEARCH_MAX_QUERY)
  const pageNumber = Number.parseInt(first(params.page) ?? "1", 10)
  const page = Number.isFinite(pageNumber) ? Math.min(Math.max(pageNumber, 1), MAX_PAGE) : 1

  const user = await getCurrentUser()
  const result =
    scope === "mine" && !user
      ? null
      : await searchDecks({ scope, userId: user?.id, query, page })

  const href = (next: { scope?: SearchScope; page?: number }) => {
    const search = new URLSearchParams()
    const nextScope = next.scope ?? scope
    if (nextScope === "mine") search.set("scope", "mine")
    if (query) search.set("q", query)
    if (next.page && next.page > 1) search.set("page", String(next.page))
    const qs = search.toString()
    return qs ? `/decks?${qs}` : "/decks"
  }

  return (
    <div className="container mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          {scope === "mine" ? "My decks" : "Public decks"}
        </h1>
        {user && (
          <Link href="/decks/new" className={buttonVariants()}>
            <PlusIcon />
            New deck
          </Link>
        )}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <nav aria-label="Deck scope" className="inline-flex shrink-0 self-start rounded-lg bg-muted p-1">
          {(["public", "mine"] as const).map((value) => (
            <Link
              key={value}
              href={href({ scope: value })}
              aria-current={scope === value ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                scope === value && "bg-background text-foreground shadow-sm"
              )}
            >
              {value === "public" ? "Public" : "My decks"}
            </Link>
          ))}
        </nav>
        <div className="flex-1">
          <DeckSearch scope={scope} maxLength={SEARCH_MAX_QUERY} />
        </div>
      </div>

      {!result ? (
        <EmptyState>
          <p>
            <Link href="/sign-in?next=%2Fdecks%3Fscope%3Dmine" className="font-medium underline underline-offset-4">
              Sign in
            </Link>{" "}
            to see and search your own decks.
          </p>
        </EmptyState>
      ) : result.decks.length === 0 ? (
        <EmptyState>
          {query ? (
            <p>
              No {scope === "mine" ? "decks of yours" : "public decks"} match &ldquo;{query}&rdquo;.
            </p>
          ) : page > 1 ? (
            <p>There are no more decks.</p>
          ) : scope === "mine" ? (
            <>
              <p>You haven&apos;t created any decks yet.</p>
              <Link href="/decks/new" className={buttonVariants()}>
                Create your first deck
              </Link>
            </>
          ) : (
            <p>No public decks yet. Make one of yours public to list it here.</p>
          )}
        </EmptyState>
      ) : (
        <>
          <p className="sr-only" aria-live="polite">
            {result.decks.length} {result.decks.length === 1 ? "result" : "results"} on page {page}
          </p>
          <DeckGrid>
            {result.decks.map((deck) => (
              <li key={deck.id}>
                <DeckTile deck={deck} show={scope === "mine" ? "visibility" : "owner"} />
              </li>
            ))}
          </DeckGrid>
        </>
      )}

      {result && (page > 1 || result.hasMore) && (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-4">
          {page > 1 ? (
            <Link href={href({ page: page - 1 })} className={buttonVariants({ variant: "outline" })}>
              <ChevronLeftIcon />
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-muted-foreground">Page {page}</span>
          {result.hasMore ? (
            <Link href={href({ page: page + 1 })} className={buttonVariants({ variant: "outline" })}>
              Next
              <ChevronRightIcon />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  )
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-10 text-center text-muted-foreground">
      {children}
    </div>
  )
}
