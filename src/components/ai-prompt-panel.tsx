"use client"

import { useId, useMemo, useRef, useState } from "react"
import { CheckIcon, CopyIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DEFAULT_AI_CARD_COUNT, buildDeckPrompt, clampCardCount } from "@/lib/ai-prompt"
import { touchTarget } from "@/lib/touch"
import { LIMITS } from "@/lib/validation"

/** Builds a copyable prompt that tells an AI assistant how to write an importable deck. */
export function AiPromptPanel() {
  const id = useId()
  const [topic, setTopic] = useState("")
  const [cardCount, setCardCount] = useState(String(DEFAULT_AI_CARD_COUNT))
  const [copied, setCopied] = useState(false)
  const promptRef = useRef<HTMLTextAreaElement>(null)

  const prompt = useMemo(
    () => buildDeckPrompt({ topic, cardCount: Number.parseInt(cardCount, 10) }),
    [topic, cardCount]
  )

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Prompt copied", {
        description: "Paste it into your AI assistant, then import the .json file it creates.",
      })
    } catch {
      // Clipboard blocked: select the text so it can be copied manually.
      promptRef.current?.focus()
      promptRef.current?.select()
      toast.info("Press Ctrl+C (or ⌘C) to copy the selected prompt.")
    }
  }

  return (
    <details className="group rounded-lg border">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
        <SparklesIcon className="size-5 shrink-0 text-muted-foreground" />
        <span className="flex flex-col">
          <span className="font-medium">Generate a deck with AI</span>
          <span className="text-sm text-muted-foreground">
            Copy a prompt for ChatGPT, Claude or Gemini that produces an importable file.
          </span>
        </span>
      </summary>

      <div className="flex flex-col gap-4 border-t p-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-topic`}>
              Topic <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id={`${id}-topic`}
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. Spanish phrases for travelling, beginner level"
              maxLength={500}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-count`}>Cards</Label>
            <Input
              id={`${id}-count`}
              type="number"
              inputMode="numeric"
              min={1}
              max={LIMITS.cardsPerDeck}
              value={cardCount}
              onChange={(event) => setCardCount(event.target.value)}
              // Read the element, not state: state can lag behind the last keystroke.
              onBlur={(event) =>
                setCardCount(String(clampCardCount(Number.parseInt(event.currentTarget.value, 10))))
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-prompt`}>Prompt</Label>
          <Textarea
            ref={promptRef}
            id={`${id}-prompt`}
            value={prompt}
            readOnly
            rows={10}
            className="font-mono text-xs"
            onFocus={(event) => event.currentTarget.select()}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ol className="list-inside list-decimal text-sm text-muted-foreground">
            <li>Copy the prompt and paste it into your AI assistant.</li>
            <li>Download the <code>.json</code> file it creates.</li>
            <li>Import the file below.</li>
          </ol>
          <Button type="button" onClick={copy} className={touchTarget}>
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy prompt"}
          </Button>
        </div>
      </div>
    </details>
  )
}
