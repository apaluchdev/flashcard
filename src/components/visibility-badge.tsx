import { GlobeIcon, LinkIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { Visibility } from "@/lib/validation"

export function VisibilityBadge({ visibility }: { visibility: Visibility }) {
  return visibility === "public" ? (
    <Badge variant="secondary">
      <GlobeIcon />
      Public
    </Badge>
  ) : (
    <Badge variant="outline" title="Hidden from search; anyone with the link can view it">
      <LinkIcon />
      Private
    </Badge>
  )
}
