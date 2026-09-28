"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

const DEBOUNCE_MS = 300

/**
 * Search box that keeps `?q=` in the URL (debounced). It is also a plain
 * GET form, so pressing Enter works before JavaScript has loaded.
 */
export function DeckSearch({ scope, maxLength }: { scope: string; maxLength: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("q") ?? "")
  const [pending, startTransition] = useTransition()
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  function navigate(q: string) {
    const params = new URLSearchParams(searchParams)
    if (q.trim()) params.set("q", q.trim())
    else params.delete("q")
    params.delete("page") // a new search starts on page 1
    startTransition(() => router.replace(`${pathname}?${params}`, { scroll: false }))
  }

  function onChange(next: string) {
    setValue(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => navigate(next), DEBOUNCE_MS)
  }

  return (
    <form
      role="search"
      action={pathname}
      onSubmit={(event) => {
        event.preventDefault()
        clearTimeout(timer.current)
        navigate(value)
      }}
      className="relative"
    >
      <input type="hidden" name="scope" value={scope} />
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        name="q"
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title or description"
        aria-label="Search decks"
        className="h-10 pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
      />
      <span className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center">
        {pending ? (
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" aria-label="Searching" />
        ) : (
          value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <XIcon className="size-4" />
            </button>
          )
        )}
      </span>
    </form>
  )
}
