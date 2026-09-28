import { Skeleton } from "@/components/ui/skeleton"

export default function DecksLoading() {
  return (
    <div className="container mx-auto w-full max-w-5xl px-4 py-8" aria-busy="true">
      <span className="sr-only">Loading decks…</span>
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 flex-1" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  )
}
