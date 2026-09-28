"use client"

import { useRef, useState, useTransition } from "react"
import {
  DownloadIcon,
  FileJsonIcon,
  Loader2Icon,
  TriangleAlertIcon,
  UploadIcon,
} from "lucide-react"
import { toast } from "sonner"

import { AiPromptPanel } from "@/components/ai-prompt-panel"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { checkDeckFile, parseDeckFile } from "@/lib/deck-json"
import type { DeckImportFile, Visibility } from "@/lib/validation"
import { importDeck } from "@/server/deck-actions"
import { cn } from "cn"

type State =
  | { status: "idle" }
  | { status: "invalid"; fileName: string; errors: string[] }
  | { status: "ready"; fileName: string; deck: DeckImportFile }

const PREVIEW_CARDS = 3

export function ImportForm() {
  const [state, setState] = useState<State>({ status: "idle" })
  const [visibility, setVisibility] = useState<Visibility>("private")
  const [dragging, setDragging] = useState(false)
  const [pending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  async function load(file: File) {
    const problem = checkDeckFile(file)
    if (problem) {
      setState({ status: "invalid", fileName: file.name, errors: [problem] })
      return
    }
    const result = parseDeckFile(await file.text())
    if (!result.ok) {
      setState({ status: "invalid", fileName: file.name, errors: result.errors })
      return
    }
    setVisibility(result.deck.visibility)
    setState({ status: "ready", fileName: file.name, deck: result.deck })
  }

  function reset() {
    setState({ status: "idle" })
    if (inputRef.current) inputRef.current.value = ""
  }

  function submit() {
    if (state.status !== "ready") return
    startTransition(async () => {
      // On success the action redirects, so a return value means failure.
      const result = await importDeck({ ...state.deck, visibility })
      if (result && !result.ok) {
        setState({ status: "invalid", fileName: state.fileName, errors: result.errors })
        toast.error("Couldn't import the deck.")
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <input
        ref={inputRef}
        id="deck-file"
        type="file"
        accept=".json,application/json"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void load(file)
        }}
      />

      {state.status !== "ready" && <AiPromptPanel />}

      {state.status !== "ready" && (
        <div
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            const file = event.dataTransfer.files[0]
            if (file) void load(file)
          }}
          className={cn(
            "flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors",
            dragging && "border-primary bg-muted/50"
          )}
        >
          <FileJsonIcon className="size-8 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            <p className="font-medium">Drop a .json deck file here</p>
            <p className="text-sm text-muted-foreground">or choose one from your device (max 1 MB)</p>
          </div>
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            <UploadIcon />
            Choose file
          </Button>
        </div>
      )}

      {state.status === "invalid" && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <p className="flex items-center gap-2 font-medium">
            <TriangleAlertIcon className="size-4" />
            {state.fileName} can&apos;t be imported
          </p>
          <ul className="list-inside list-disc font-mono text-xs">
            {state.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {state.status === "ready" && (
        <section aria-label="Import preview" className="flex flex-col gap-4 rounded-lg border p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-xs text-muted-foreground">{state.fileName}</p>
              <h2 className="text-lg font-semibold break-words">{state.deck.title}</h2>
              {state.deck.description && (
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {state.deck.description}
                </p>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {state.deck.cards.length} {state.deck.cards.length === 1 ? "card" : "cards"}
            </span>
          </div>

          <ol className="flex flex-col divide-y rounded-md border text-sm">
            {state.deck.cards.slice(0, PREVIEW_CARDS).map((card, i) => (
              <li key={i} className="grid gap-1 p-3 sm:grid-cols-2 sm:gap-4">
                <p className="line-clamp-3 whitespace-pre-line break-words">{card.front}</p>
                <p className="line-clamp-3 whitespace-pre-line break-words text-muted-foreground">
                  {card.back}
                </p>
              </li>
            ))}
          </ol>
          {state.deck.cards.length > PREVIEW_CARDS && (
            <p className="-mt-2 text-xs text-muted-foreground">
              …and {state.deck.cards.length - PREVIEW_CARDS} more
            </p>
          )}

          <div className="flex items-start gap-3">
            <Switch
              id="import-visibility"
              checked={visibility === "public"}
              onCheckedChange={(checked) => setVisibility(checked ? "public" : "private")}
              aria-labelledby="import-visibility-label"
              aria-describedby="import-visibility-hint"
              className="mt-0.5"
            />
            <div className="flex flex-col gap-1">
              <Label id="import-visibility-label" htmlFor="import-visibility">
                Public
              </Label>
              <p id="import-visibility-hint" className="text-sm text-muted-foreground">
                {visibility === "public"
                  ? "Anyone can find this deck in search."
                  : "Hidden from search. Only people with the link can view it."}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={reset} disabled={pending}>
              Choose another file
            </Button>
            <Button type="button" onClick={submit} disabled={pending}>
              {pending && <Loader2Icon className="animate-spin" />}
              Import deck
            </Button>
          </div>
        </section>
      )}

      <details className="rounded-lg border text-sm">
        <summary className="cursor-pointer p-4 font-medium">File format</summary>
        <div className="flex flex-col gap-3 border-t p-4">
          <p className="text-muted-foreground">
            A JSON object with a <code>title</code> and a list of <code>cards</code>, each with a{" "}
            <code>front</code> and <code>back</code>. <code>description</code> and{" "}
            <code>visibility</code> (<code>&quot;private&quot;</code> or{" "}
            <code>&quot;public&quot;</code>) are optional. Cards keep the order they have in the
            file. Up to 1,000 cards.
          </p>
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">{`{
  "title": "Spanish Basics",
  "description": "Common greetings",
  "cards": [
    { "front": "Hola", "back": "Hello" },
    { "front": "Gracias", "back": "Thank you" }
  ]
}`}</pre>
          <a
            href="/deck-example.json"
            download="deck-example.json"
            className="inline-flex items-center gap-1.5 self-start font-medium underline-offset-4 hover:underline"
          >
            <DownloadIcon className="size-4" />
            Download example file
          </a>
        </div>
      </details>
    </div>
  )
}
