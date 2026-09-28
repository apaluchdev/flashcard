import Link from "next/link"
import { LayersIcon, PlusIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { getCurrentUser } from "@/server/session"

export async function SiteHeader() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <LayersIcon className="size-5" />
          Flashcards
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href="/decks" className={buttonVariants({ variant: "ghost" })}>
            Browse
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/decks/new"
            className={buttonVariants({ variant: "outline" })}
          >
            <PlusIcon />
            <span className="sr-only sm:not-sr-only">New deck</span>
          </Link>
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
