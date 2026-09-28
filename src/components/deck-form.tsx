"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { touchTarget } from "@/lib/touch"
import { LIMITS, deckInput, type Visibility } from "@/lib/validation"
import { createDeck, updateDeck } from "@/server/deck-actions"

type EditorCard = { key: string; id?: string; front: string; back: string }

export type DeckFormInitial = {
  title: string
  description: string | null
  visibility: Visibility
  cards: { id: string; front: string; back: string }[]
}

type DeckFormProps =
  | { mode: "create"; initial?: undefined; deckId?: undefined }
  | { mode: "edit"; initial: DeckFormInitial; deckId: string }

type FieldErrors = Record<string, string>

export function DeckForm({ mode, initial, deckId }: DeckFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [visibility, setVisibility] = useState<Visibility>(
    initial?.visibility ?? "private"
  )
  const [cards, setCards] = useState<EditorCard[]>(() =>
    initial
      ? initial.cards.map((card) => ({ key: card.id, ...card }))
      : [{ key: "new-0", front: "", back: "" }]
  )
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverErrors, setServerErrors] = useState<string[]>([])
  const [pending, startTransition] = useTransition()
  const nextKey = useRef(1)
  // Card to focus once it has rendered (set by "Add card").
  const focusAfterRender = useRef<string | null>(null)

  const payload = useMemo(
    () => ({
      title,
      description,
      visibility,
      cards: cards.map(({ id, front, back }) => ({ id, front, back })),
    }),
    [title, description, visibility, cards]
  )

  const [savedSnapshot] = useState(() => JSON.stringify(payload))
  const dirty = JSON.stringify(payload) !== savedSnapshot

  // Warn before closing or reloading the tab with unsaved edits.
  useEffect(() => {
    if (!dirty || pending) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [dirty, pending])

  useEffect(() => {
    if (!focusAfterRender.current) return
    document.getElementById(`card-${focusAfterRender.current}-front`)?.focus()
    focusAfterRender.current = null
  }, [cards])

  function updateCard(key: string, field: "front" | "back", value: string) {
    setCards((current) =>
      current.map((card) => (card.key === key ? { ...card, [field]: value } : card))
    )
  }

  function addCard() {
    const key = `new-${nextKey.current++}`
    setCards((current) => [...current, { key, front: "", back: "" }])
    focusAfterRender.current = key
  }

  function removeCard(key: string) {
    setCards((current) => current.filter((card) => card.key !== key))
  }

  function moveCard(index: number, offset: -1 | 1) {
    setCards((current) => {
      const target = index + offset
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      ;[next[index], next[target]] = [next[target]!, next[index]!]
      return next
    })
  }

  function submit() {
    setServerErrors([])
    const parsed = deckInput.safeParse(payload)
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const [first, index, field] = issue.path
        const path =
          first === "cards" && typeof index === "number" && field
            ? `cards.${cards[index]!.key}.${String(field)}`
            : String(first ?? "form")
        fieldErrors[path] ??= issue.message
      }
      setErrors(fieldErrors)
      const count = Object.keys(fieldErrors).length
      toast.error(`Please fix ${count} ${count === 1 ? "problem" : "problems"} before saving.`)
      return
    }

    setErrors({})
    startTransition(async () => {
      // On success the action redirects, so a return value means failure.
      const result =
        mode === "create"
          ? await createDeck(parsed.data)
          : await updateDeck(deckId, parsed.data)
      if (result && !result.ok) {
        setServerErrors(result.errors)
        toast.error("Couldn't save the deck.")
      }
    })
  }

  const cancelHref = mode === "edit" ? `/decks/${deckId}` : "/decks"

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
          event.preventDefault()
          submit()
        }
      }}
      className="flex flex-col gap-8"
    >
      {serverErrors.length > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <ul className="list-inside list-disc">
            {serverErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="flex flex-col gap-5">
        <Field label="Title" htmlFor="title" error={errors.title}>
          <Input
            id="title"
            value={title}
            maxLength={LIMITS.title}
            placeholder="e.g. Spanish basics"
            aria-invalid={!!errors.title}
            autoFocus={mode === "create"}
            onChange={(event) => setTitle(event.target.value)}
          />
        </Field>

        <Field
          label="Description"
          hint="Optional"
          htmlFor="description"
          error={errors.description}
        >
          <Textarea
            id="description"
            value={description}
            maxLength={LIMITS.description}
            placeholder="What is this deck about?"
            rows={3}
            aria-invalid={!!errors.description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Field>

        <div className="flex items-start gap-3 rounded-lg border p-4">
          <Switch
            id="visibility"
            checked={visibility === "public"}
            onCheckedChange={(checked) => setVisibility(checked ? "public" : "private")}
            aria-labelledby="visibility-label"
            aria-describedby="visibility-hint"
            className="mt-0.5"
          />
          <div className="flex flex-col gap-1">
            <Label id="visibility-label" htmlFor="visibility">
              Public
            </Label>
            <p id="visibility-hint" className="text-sm text-muted-foreground">
              {visibility === "public"
                ? "Anyone can find this deck in search."
                : "Hidden from search. Only people with the link can view it."}
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="cards-heading">
        <div className="flex items-baseline justify-between">
          <h2 id="cards-heading" className="text-lg font-semibold">
            Cards
          </h2>
          <span className="text-sm text-muted-foreground">
            {cards.length} / {LIMITS.cardsPerDeck.toLocaleString("en-US")}
          </span>
        </div>
        {errors.cards && <p className="text-sm text-destructive">{errors.cards}</p>}

        {cards.length === 0 && (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No cards yet. Add your first card below.
          </p>
        )}

        <ol className="flex flex-col gap-4">
          {cards.map((card, index) => (
            <li key={card.key} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Card {index + 1}
                </span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className={touchTarget}
                    aria-label={`Move card ${index + 1} up`}
                    disabled={index === 0}
                    onClick={() => moveCard(index, -1)}
                  >
                    <ArrowUpIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className={touchTarget}
                    aria-label={`Move card ${index + 1} down`}
                    disabled={index === cards.length - 1}
                    onClick={() => moveCard(index, 1)}
                  >
                    <ArrowDownIcon />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className={touchTarget}
                    aria-label={`Delete card ${index + 1}`}
                    onClick={() => removeCard(card.key)}
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(["front", "back"] as const).map((side) => {
                  const fieldId = `card-${card.key}-${side}`
                  const error = errors[`cards.${card.key}.${side}`]
                  return (
                    <Field
                      key={side}
                      label={side === "front" ? "Front" : "Back"}
                      htmlFor={fieldId}
                      error={error}
                    >
                      <Textarea
                        id={fieldId}
                        value={card[side]}
                        maxLength={LIMITS.cardText}
                        rows={3}
                        placeholder={side === "front" ? "Question" : "Answer"}
                        aria-invalid={!!error}
                        onChange={(event) =>
                          updateCard(card.key, side, event.target.value)
                        }
                      />
                    </Field>
                  )
                })}
              </div>
            </li>
          ))}
        </ol>

        <Button
          type="button"
          variant="outline"
          className="h-11 border-dashed"
          disabled={cards.length >= LIMITS.cardsPerDeck}
          onClick={addCard}
        >
          <PlusIcon />
          Add card
        </Button>
      </section>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t bg-background/90 px-4 py-3 backdrop-blur">
        <span className="mr-auto text-sm text-muted-foreground" aria-live="polite">
          {dirty ? "Unsaved changes" : ""}
        </span>
        <Link href={cancelHref} className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </Link>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2Icon className="animate-spin" />}
          {mode === "create" ? "Create deck" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  hint,
  htmlFor,
  error,
  children,
}: {
  label: string
  hint?: string
  htmlFor: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>
        {label}
        {hint && <span className="font-normal text-muted-foreground">({hint})</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
