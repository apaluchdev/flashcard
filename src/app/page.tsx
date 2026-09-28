import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function Home() {
  return (
    <section className="container mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
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
        <Link
          href="/decks"
          className={buttonVariants({ size: "lg", variant: "outline" })}
        >
          Browse decks
        </Link>
      </div>
    </section>
  )
}
