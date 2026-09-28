"use client"

import Link from "next/link"
import { useEffect } from "react"
import { RotateCcwIcon } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

// Shown when a page throws (e.g. the database is unreachable). Details stay
// in the server logs; users get a way to retry.
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  // Re-fetches server data and re-renders (reset() would only re-render).
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground">
        We couldn&apos;t load this page. Please try again in a moment.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-muted-foreground">Error reference: {error.digest}</p>
      )}
      <div className="flex gap-3">
        <Button onClick={() => retry()}>
          <RotateCcwIcon />
          Try again
        </Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Go home
        </Link>
      </div>
    </div>
  )
}
