import Link from "next/link"

import { VisibilityBadge } from "@/components/visibility-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatRelativeTime, pluralize } from "@/lib/format"
import type { DeckSummary } from "@/server/decks"

/** A deck in search results. Owner is shown for public listings, visibility for your own. */
export function DeckTile({
  deck,
  show,
}: {
  deck: DeckSummary
  show: "owner" | "visibility"
}) {
  return (
    <Link
      href={`/decks/${deck.id}`}
      className="flex h-full flex-col gap-2 rounded-lg border p-4 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span className="line-clamp-2 font-medium break-words">{deck.title}</span>
      {deck.description && (
        <span className="line-clamp-2 text-sm break-words text-muted-foreground">
          {deck.description}
        </span>
      )}
      <span className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 text-xs text-muted-foreground">
        {show === "owner" ? (
          <span className="flex min-w-0 items-center gap-1.5">
            <Avatar size="sm" className="size-5">
              {deck.owner.image && <AvatarImage src={deck.owner.image} alt="" />}
              <AvatarFallback className="text-[0.6rem]">{deck.owner.name.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <span className="truncate">{deck.owner.name}</span>
          </span>
        ) : (
          <VisibilityBadge visibility={deck.visibility} />
        )}
        <span aria-hidden="true">·</span>
        <span>{pluralize(deck.cardCount, "card")}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={deck.updatedAt.toISOString()}>
          {formatRelativeTime(deck.updatedAt)}
        </time>
      </span>
    </Link>
  )
}

export function DeckGrid({ children }: { children: React.ReactNode }) {
  return <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>
}
