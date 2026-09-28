"use client"

import { Share2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import type { Visibility } from "@/lib/validation"

type ShareButtonProps = {
  deckId: string
  title: string
  visibility: Visibility
}

export function ShareButton({ deckId, title, visibility }: ShareButtonProps) {
  async function share() {
    const url = `${window.location.origin}/decks/${deckId}`

    // Phones get the native share sheet; desktops copy the link.
    const touch = window.matchMedia("(pointer: coarse)").matches
    if (touch && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        // Share sheet unavailable: fall through to copying.
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied", {
        description:
          visibility === "private"
            ? "This deck is private: only people with the link can view it."
            : undefined,
      })
    } catch {
      // Clipboard blocked (e.g. insecure context): show the link to copy by hand.
      toast.info("Copy this link", { description: url, duration: 15_000 })
    }
  }

  return (
    <Button variant="outline" onClick={share}>
      <Share2Icon />
      Share
    </Button>
  )
}
