import { deckFileName, toDeckFile } from "@/lib/deck-json"
import { getDeckForView } from "@/server/decks"
import { getCurrentUser } from "@/server/session"

// GET /decks/{id}/export — downloads the deck in the import format.
// Anyone who can view the deck (i.e. has the link) can export it.
export async function GET(_request: Request, ctx: RouteContext<"/decks/[id]/export">) {
  const { id } = await ctx.params
  const [deck, user] = await Promise.all([getDeckForView(id), getCurrentUser()])
  if (!deck) return new Response("Deck not found", { status: 404 })

  const isOwner = user?.id === deck.owner.id
  const file = toDeckFile({
    title: deck.title,
    description: deck.description,
    // Only the owner's export keeps visibility; copies re-import as private.
    visibility: isOwner ? deck.visibility : undefined,
    cards: deck.cards,
  })

  const name = deckFileName(deck.title)
  return new Response(`${JSON.stringify(file, null, 2)}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      // Private decks are link-only; don't let shared caches keep copies.
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
