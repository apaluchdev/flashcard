import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function DeckNotFound() {
  return (
    <div className="container mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Deck not found</h1>
      <p className="text-muted-foreground">
        This deck doesn&apos;t exist, was deleted, or the link is incomplete.
      </p>
      <Link href="/decks" className={buttonVariants({ variant: "outline" })}>
        Browse decks
      </Link>
    </div>
  )
}
