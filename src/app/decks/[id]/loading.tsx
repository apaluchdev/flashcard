import { Skeleton } from "@/components/ui/skeleton"

// Neutral skeleton shared by the deck page and its edit page.
export default function DeckLoading() {
  return (
    <div className="container mx-auto w-full max-w-3xl px-4 py-8" aria-busy="true">
      <span className="sr-only">Loading deck…</span>
      <div className="mb-8 flex flex-col gap-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-48" />
      </div>
      <Skeleton className="h-72 w-full rounded-xl sm:h-auto sm:aspect-[3/2]" />
    </div>
  )
}
