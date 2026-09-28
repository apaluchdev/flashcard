"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RotateCcwIcon,
  ShuffleIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { shuffledOrder } from "@/lib/shuffle"
import { cn } from "cn"

type ViewerCard = { id: string; front: string; back: string }

// 44px controls on touch screens; the regular sizes with a mouse.
const touchTarget = "[@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:min-w-11"

const savedOrder = (length: number) => Array.from({ length }, (_, i) => i)

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

function isInteractive(target: EventTarget | null) {
  return target instanceof HTMLElement && !!target.closest("button, a, [role=button]")
}

export function CardViewer({ cards }: { cards: ViewerCard[] }) {
  const total = cards.length
  const [order, setOrder] = useState(() => savedOrder(total))
  const [shuffled, setShuffled] = useState(false)
  const [position, setPosition] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [finished, setFinished] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const card = cards[order[position]!]!

  const goTo = useCallback((next: number) => {
    setFlipped(false)
    setFinished(false)
    setPosition(next)
  }, [])

  const next = useCallback(() => {
    if (finished) return
    if (position === total - 1) {
      setFlipped(false)
      setFinished(true)
    } else {
      goTo(position + 1)
    }
  }, [finished, position, total, goTo])

  const previous = useCallback(() => {
    if (finished) goTo(total - 1)
    else if (position > 0) goTo(position - 1)
  }, [finished, position, total, goTo])

  const flip = useCallback(() => {
    if (!finished) setFlipped((value) => !value)
  }, [finished])

  const restart = useCallback(
    (shuffle: boolean) => {
      setShuffled(shuffle)
      setOrder(shuffle ? shuffledOrder(total) : savedOrder(total))
      goTo(0)
    },
    [total, goTo]
  )

  // Keyboard: Space/Enter flip, ←/→ navigate, S toggles shuffle.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (isTypingTarget(event.target)) return
      switch (event.key) {
        case " ":
        case "Enter":
          // A focused button already handles these natively.
          if (isInteractive(event.target)) return
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
          restart(!shuffled)
          break
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [flip, next, previous, restart, shuffled])

  const shown = finished ? total : position + 1
  const sideLabel = flipped ? "Answer" : "Question"
  const sideText = flipped ? card.back : card.front

  return (
    <section aria-label="Study cards" className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm tabular-nums text-muted-foreground" aria-live="polite">
          {finished ? "Finished" : `Card ${shown} of ${total}`}
        </span>
        <Button
          variant={shuffled ? "secondary" : "ghost"}
          size="sm"
          className={touchTarget}
          aria-pressed={shuffled}
          onClick={() => restart(!shuffled)}
        >
          <ShuffleIcon />
          {shuffled ? "Shuffled" : "Shuffle"}
        </Button>
      </div>

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

      {finished ? (
        <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-xl border bg-card p-8 text-center sm:aspect-[3/2] sm:min-h-0">
          <p className="text-2xl font-semibold">You&apos;ve reached the end</p>
          <p className="text-muted-foreground">
            You went through all {total} {total === 1 ? "card" : "cards"}.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => restart(shuffled)} autoFocus>
              <RotateCcwIcon />
              Restart
            </Button>
            <Button variant="outline" onClick={() => restart(true)}>
              <ShuffleIcon />
              Shuffle &amp; restart
            </Button>
          </div>
        </div>
      ) : (
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
              {sideLabel}: {sideText}. Activate to flip.
            </span>
            <div
              // Remount per card so a new card starts on its front without animating.
              key={`${order[position]}`}
              aria-hidden="true"
              className={cn(
                "relative min-h-72 w-full transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none sm:aspect-[3/2] sm:min-h-0",
                flipped && "[transform:rotateY(180deg)]"
              )}
            >
              <CardFace label="Question" text={card.front} />
              <CardFace label="Answer" text={card.back} back />
            </div>
          </button>
        </div>
      )}

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
          <Button
            variant="secondary"
            size="lg"
            onClick={flip}
            className={cn(touchTarget, "min-w-28")}
          >
            {flipped ? "Show question" : "Show answer"}
          </Button>
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

      <p className="hidden text-center text-xs text-muted-foreground [@media(pointer:fine)]:block">
        <Kbd>Space</Kbd> flip · <Kbd>←</Kbd> <Kbd>→</Kbd> navigate · <Kbd>S</Kbd> shuffle
      </p>
    </section>
  )
}

function CardFace({ label, text, back = false }: { label: string; text: string; back?: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col rounded-xl border bg-card p-6 shadow-sm [backface-visibility:hidden] transition-colors group-hover:border-ring/40 sm:p-8",
        back && "[transform:rotateY(180deg)]"
      )}
    >
      <span
        className={cn(
          "text-xs font-medium tracking-wide uppercase",
          back ? "text-primary" : "text-muted-foreground"
        )}
      >
        {label}
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
