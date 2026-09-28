"use client"

import { useOptimistic, useTransition } from "react"
import { ChevronDownIcon, GlobeIcon, LinkIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { VISIBILITIES, type Visibility } from "@/lib/validation"
import { setVisibility } from "@/server/deck-actions"
import { cn } from "cn"

const options: Record<
  Visibility,
  { label: string; description: string; Icon: typeof GlobeIcon }
> = {
  public: {
    label: "Public",
    description: "Listed in search. Anyone can view it.",
    Icon: GlobeIcon,
  },
  private: {
    label: "Private",
    description: "Hidden from search. Only people with the link can view it.",
    Icon: LinkIcon,
  },
}

/** Owner-only control to switch a deck between public and private. */
export function VisibilityMenu({
  deckId,
  visibility,
}: {
  deckId: string
  visibility: Visibility
}) {
  const [pending, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useOptimistic(visibility)
  const { label, Icon } = options[optimistic]

  function change(next: Visibility) {
    if (next === optimistic) return
    startTransition(async () => {
      setOptimistic(next)
      const result = await setVisibility(deckId, next)
      if (!result.ok) toast.error(result.errors[0])
      else toast.success(next === "public" ? "Deck is now public" : "Deck is now private")
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Visibility: ${label}. Change visibility`}
        className={cn(
          "inline-flex h-6 items-center gap-1 rounded-4xl border px-2 text-xs font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
          optimistic === "public" && "border-transparent bg-secondary text-secondary-foreground"
        )}
      >
        {pending ? <Loader2Icon className="size-3 animate-spin" /> : <Icon className="size-3" />}
        {label}
        <ChevronDownIcon className="size-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuRadioGroup
          value={optimistic}
          onValueChange={(value: Visibility) => change(value)}
        >
          {VISIBILITIES.map((value) => {
            const option = options[value]
            return (
              <DropdownMenuRadioItem
                key={value}
                value={value}
                closeOnClick
                className="items-start py-2"
              >
                <option.Icon className="mt-0.5" />
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </span>
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
