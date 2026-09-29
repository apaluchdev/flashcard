"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PartyPopperIcon,
  RotateCcwIcon,
  ShuffleIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CARD_FILTERS,
  buildOrder,
  countByFilter,
  matchesFilter,
  removeFromOrder,
  type CardFilter,
} from "@/lib/study"
import { touchTarget } from "@/lib/touch"
import { setCardRetired, unretireAll } from "@/server/retirement-actions"
import { cn } from "cn"

type StudyCard = { id: string; front: string; back: string }

const FILTER_LABELS: Record<CardFilter, string> = {
  unretired: "Unretired",
  retired: "Retired",
  all: "All",
}

/** Short text is shown large and centered; long text smaller and left-aligned. */
function textSizeClass(text: string) {
  if (text.length <= 60) return "text-2xl sm:text-3xl text-center"
  if (text.length <= 240) return "text-lg sm:text-xl text-center"
  return "text-base text-left"
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  )
}

// Elements that handle Space/Enter themselves.
const WIDGETS =
  "button, a[href], summary, [role=button], [role^=menuitem], [role=option], [role=tab], [role=switch], [role=checkbox], [role=radio], [role=slider], [role=combobox]"
// While focus is in one of these, no shortcut applies (e.g. menu typeahead on "S").
const POPUPS = "[role=menu], [role=dialog], [role=alertdialog], [role=listbox]"

function closest(target: EventTarget | null, selector: string) {
  return target instanceof Element && !!target.closest(selector)
}

type DeckStudyProps = {
  deckId: string
  cards: StudyCard[]
  /** The viewer's retired card ids; empty for guests. */
  initialRetiredIds: string[]
  /** Signed-in viewers can retire cards; guests get a sign-in hint instead. */
  canRetire: boolean
  signInHref: string
}

/**
 * Study viewer (flip, navigate, shuffle) plus per-user "retired" cards with
 * an Unretired / Retired / All filter, and the full card list.
 */
export function DeckStudy({ deckId, cards, initialRetiredIds, canRetire, signInHref }: DeckStudyProps) {
  const [retired, setRetired] = useState(() => new Set(initialRetiredIds))
  const [filter, setFilter] = useState<CardFilter>(canRetire ? "unretired" : "all")
  const [shuffled, setShuffled] = useState(false)
  const [order, setOrder] = useState(() =>
    buildOrder(cards, new Set(initialRetiredIds), canRetire ? "unretired" : "all", false)
  )
  const [position, setPosition] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [finished, setFinished] = useState(false)
  const [, startTransition] = useTransition()
  const touchStartX = useRef<number | null>(null)

  const total = order.length
  const counts = countByFilter(cards, retired)
  const cardIndex = order[position]
  const card = cardIndex === undefined ? undefined : cards[cardIndex]
  const cardIsRetired = card ? retired.has(card.id) : false

  const goTo = useCallback((next: number) => {
    setFlipped(false)
    setFinished(false)
    setPosition(next)
  }, [])

  const next = useCallback(() => {
    if (finished || total === 0) return
    if (position === total - 1) {
      setFlipped(false)
      setFinished(true)
    } else {
      goTo(position + 1)
    }
  }, [finished, position, total, goTo])

  const previous = useCallback(() => {
    if (total === 0) return
    if (finished) goTo(total - 1)
    else if (position > 0) goTo(position - 1)
  }, [finished, position, total, goTo])

  const flip = useCallback(() => {
    if (!finished && card) setFlipped((value) => !value)
  }, [finished, card])

  /** Rebuilds the order for a filter/shuffle combination and starts at card 1. */
  const restart = useCallback(
    (options: { shuffle?: boolean; filter?: CardFilter; retired?: ReadonlySet<string> } = {}) => {
      const nextShuffle = options.shuffle ?? shuffled
      const nextFilter = options.filter ?? filter
      setShuffled(nextShuffle)
      setFilter(nextFilter)
      setOrder(buildOrder(cards, options.retired ?? retired, nextFilter, nextShuffle))
      goTo(0)
    },
    [cards, filter, retired, shuffled, goTo]
  )

  const toggleRetired = useCallback(
    (index: number) => {
      const target = cards[index]
      if (!canRetire || !target) return
      const nowRetired = !retired.has(target.id)

      const nextRetired = new Set(retired)
      if (nowRetired) nextRetired.add(target.id)
      else nextRetired.delete(target.id)
      setRetired(nextRetired)

      // A card that no longer matches the filter leaves the current round.
      const at = order.indexOf(index)
      if (at !== -1 && !matchesFilter(nowRetired, filter)) {
        const result = removeFromOrder(order, position, at)
        setOrder(result.order)
        setPosition(result.position)
        if (at === position) setFlipped(false)
        if (result.finished) setFinished(true)
      }

      startTransition(async () => {
        const result = await setCardRetired(deckId, target.id, nowRetired)
        if (!result.ok) {
          setRetired((current) => {
            const reverted = new Set(current)
            if (nowRetired) reverted.delete(target.id)
            else reverted.add(target.id)
            return reverted
          })
          toast.error(result.error)
        }
      })
    },
    [canRetire, cards, deckId, filter, order, position, retired]
  )

  function unretireEverything() {
    const previousRetired = retired
    restart({ retired: new Set(), filter: "unretired" })
    setRetired(new Set())
    startTransition(async () => {
      const result = await unretireAll(deckId)
      if (!result.ok) {
        setRetired(previousRetired)
        toast.error(result.error)
      } else {
        toast.success("All cards are back in rotation")
      }
    })
  }

  // Keyboard: Space/Enter flip, ←/→ navigate, S shuffle, R retire.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented) return // already handled by another control
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (isTypingTarget(event.target) || closest(event.target, POPUPS)) return
      switch (event.key) {
        case " ":
        case "Enter":
          // A focused control already handles these natively.
          if (closest(event.target, WIDGETS)) return
          event.preventDefault()
          flip()
          break
        case "ArrowRight":
          event.preventDefault()
          next()
          break
        case "ArrowLeft":
          event.preventDefault()
          previous()
          break
        case "s":
        case "S":
          restart({ shuffle: !shuffled })
          break
        case "r":
        case "R":
          if (cardIndex !== undefined && !finished) toggleRetired(cardIndex)
          break
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [flip, next, previous, restart, shuffled, toggleRetired, cardIndex, finished])

  const shown = finished ? total : position + 1

  return (
    <div className="flex flex-col gap-10">
      <section aria-label="Study cards" className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {canRetire ? (
            <div
              role="group"
              aria-label="Show cards"
              className="inline-flex rounded-lg bg-muted p-1"
            >
              {CARD_FILTERS.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={filter === value}
                  onClick={() => filter !== value && restart({ filter: value })}
                  className={cn(
                    "rounded-md px-3 py-1 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [@media(pointer:coarse)]:py-2.5",
                    filter === value && "bg-background text-foreground shadow-sm"
                  )}
                >
                  {FILTER_LABELS[value]}{" "}
                  <span className="tabular-nums text-muted-foreground">{counts[value]}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              <Link href={signInHref} className="font-medium text-foreground underline underline-offset-4">
                Sign in
              </Link>{" "}
              to retire cards you&apos;ve memorized.
            </p>
          )}
          <Button
            variant={shuffled ? "secondary" : "ghost"}
            size="sm"
            className={touchTarget}
            aria-pressed={shuffled}
            onClick={() => restart({ shuffle: !shuffled })}
            disabled={total < 2}
          >
            <ShuffleIcon />
            {shuffled ? "Shuffled" : "Shuffle"}
          </Button>
        </div>

        <span className="text-sm tabular-nums text-muted-foreground" aria-live="polite">
          {total === 0
            ? "No cards to show"
            : finished
              ? "Finished"
              : `Card ${shown} of ${total}${filter !== "all" ? ` (${FILTER_LABELS[filter].toLowerCase()})` : ""}`}
        </span>

        {total > 0 && (
          <div
            className="h-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Progress"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={shown}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${(shown / total) * 100}%` }}
            />
          </div>
        )}

        {total === 0 ? (
          <Panel>
            {filter === "unretired" ? (
              <>
                <PartyPopperIcon className="size-8 text-muted-foreground" />
                <p className="text-2xl font-semibold">Every card is retired</p>
                <p className="text-muted-foreground">
                  You&apos;ve marked all {cards.length} cards as memorized.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button onClick={() => restart({ filter: "retired" })}>Review retired cards</Button>
                  <Button variant="outline" onClick={unretireEverything}>
                    <ArchiveRestoreIcon />
                    Unretire all
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold">No retired cards yet</p>
                <p className="max-w-sm text-muted-foreground">
                  When you&apos;re confident you know a card, press <strong>Retire</strong> (or{" "}
                  <Kbd>R</Kbd>) to take it out of your study rotation.
                </p>
                <Button variant="outline" onClick={() => restart({ filter: "unretired" })}>
                  Study unretired cards
                </Button>
              </>
            )}
          </Panel>
        ) : finished ? (
          <Panel>
            <p className="text-2xl font-semibold">You&apos;ve reached the end</p>
            <p className="text-muted-foreground">
              You went through all {total} {total === 1 ? "card" : "cards"}
              {filter !== "all" ? ` (${FILTER_LABELS[filter].toLowerCase()})` : ""}.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => restart()} autoFocus>
                <RotateCcwIcon />
                Restart
              </Button>
              <Button variant="outline" onClick={() => restart({ shuffle: true })}>
                <ShuffleIcon />
                Shuffle &amp; restart
              </Button>
            </div>
          </Panel>
        ) : (
          card && (
            <div className="[perspective:1600px]">
              <button
                type="button"
                onClick={flip}
                onTouchStart={(event) => {
                  touchStartX.current = event.touches[0]?.clientX ?? null
                }}
                onTouchEnd={(event) => {
                  const start = touchStartX.current
                  const end = event.changedTouches[0]?.clientX
                  touchStartX.current = null
                  if (start == null || end == null || Math.abs(end - start) < 60) return
                  event.preventDefault() // a swipe is not a tap-to-flip
                  if (end < start) next()
                  else previous()
                }}
                className="group block w-full rounded-xl text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {/* Screen readers get the visible side only; both faces are aria-hidden. */}
                <span className="sr-only">
                  {flipped ? "Answer" : "Question"}: {flipped ? card.back : card.front}.
                  {cardIsRetired ? " Retired." : ""} Activate to flip.
                </span>
                <div
                  // Remount per card so a new card starts on its front without animating.
                  key={card.id}
                  aria-hidden="true"
                  className={cn(
                    "relative min-h-72 w-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none sm:aspect-[3/2] sm:min-h-0",
                    flipped && "[transform:rotateY(180deg)]"
                  )}
                >
                  <CardFace label="Question" text={card.front} retired={cardIsRetired} />
                  <CardFace label="Answer" text={card.back} retired={cardIsRetired} back />
                </div>
              </button>
            </div>
          )
        )}

        {total > 0 && (
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="lg"
              className={touchTarget}
              onClick={previous}
              disabled={!finished && position === 0}
              aria-label="Previous card"
            >
              <ChevronLeftIcon />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            {!finished && (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={flip}
                  className={cn(touchTarget, "min-w-28")}
                >
                  {flipped ? "Show question" : "Show answer"}
                </Button>
                {canRetire && cardIndex !== undefined && (
                  <Button
                    variant="outline"
                    size="lg"
                    className={touchTarget}
                    aria-pressed={cardIsRetired}
                    onClick={() => toggleRetired(cardIndex)}
                    title={cardIsRetired ? "Put this card back in rotation (R)" : "I know this card (R)"}
                  >
                    {cardIsRetired ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
                    <span className="hidden sm:inline">{cardIsRetired ? "Unretire" : "Retire"}</span>
                    <span className="sr-only sm:hidden">{cardIsRetired ? "Unretire card" : "Retire card"}</span>
                  </Button>
                )}
              </div>
            )}
            <Button
              variant="outline"
              size="lg"
              className={touchTarget}
              onClick={next}
              disabled={finished}
              aria-label="Next card"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon />
            </Button>
          </div>
        )}

        <p className="hidden text-center text-xs text-muted-foreground [@media(pointer:fine)]:block">
          <Kbd>Space</Kbd> flip · <Kbd>←</Kbd> <Kbd>→</Kbd> navigate · <Kbd>S</Kbd> shuffle
          {canRetire && (
            <>
              {" "}
              · <Kbd>R</Kbd> retire
            </>
          )}
        </p>
      </section>

      <details className="group rounded-lg border">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-medium [&::-webkit-details-marker]:hidden">
          <span>
            All cards ({cards.length})
            {canRetire && counts.retired > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                {counts.retired} retired
              </span>
            )}
          </span>
          <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <ol className="flex flex-col divide-y border-t">
          {cards.map((item, index) => {
            const isRetired = retired.has(item.id)
            return (
              <li
                key={item.id}
                className={cn("flex items-start gap-3 p-4", isRetired && "bg-muted/40")}
              >
                <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                  <p className="whitespace-pre-line break-words">
                    <span className="sr-only">Card {index + 1} question: </span>
                    {item.front}
                  </p>
                  <p className="whitespace-pre-line break-words text-muted-foreground">
                    <span className="sr-only">Answer: </span>
                    {item.back}
                  </p>
                </div>
                {canRetire && (
                  <div className="flex shrink-0 items-center gap-2">
                    {isRetired && <Badge variant="secondary">Retired</Badge>}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className={touchTarget}
                      aria-pressed={isRetired}
                      aria-label={`${isRetired ? "Unretire" : "Retire"} card ${index + 1}`}
                      title={isRetired ? "Unretire" : "Retire"}
                      onClick={() => toggleRetired(index)}
                    >
                      {isRetired ? <ArchiveRestoreIcon /> : <ArchiveIcon />}
                    </Button>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
        {canRetire && counts.retired > 0 && (
          <div className="flex justify-end border-t p-3">
            <Button variant="ghost" size="sm" className={touchTarget} onClick={unretireEverything}>
              <ArchiveRestoreIcon />
              Unretire all
            </Button>
          </div>
        )}
      </details>
    </div>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-xl border bg-card p-8 text-center sm:aspect-[3/2] sm:min-h-0">
      {children}
    </div>
  )
}

function CardFace({
  label,
  text,
  retired,
  back = false,
}: {
  label: string
  text: string
  retired: boolean
  back?: boolean
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col rounded-xl border bg-card p-6 shadow-sm [backface-visibility:hidden] transition-colors group-hover:border-ring/40 sm:p-8",
        back && "[transform:rotateY(180deg)]"
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-xs font-medium tracking-wide uppercase",
            back ? "text-primary" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
        {retired && (
          <Badge variant="secondary">
            <ArchiveIcon />
            Retired
          </Badge>
        )}
      </span>
      {/* my-auto (not items-center) keeps the top of long text scrollable. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto py-4">
        <p className={cn("my-auto w-full whitespace-pre-line break-words", textSizeClass(text))}>
          {text}
        </p>
      </div>
    </div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem]">{children}</kbd>
  )
}
