"use client"

import { useTransition } from "react"
import { Loader2Icon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { deleteDeck } from "@/server/deck-actions"

export function DeleteDeckButton({
  deckId,
  title,
}: {
  deckId: string
  title: string
}) {
  const [pending, startTransition] = useTransition()

  function confirmDelete() {
    startTransition(async () => {
      // On success the action redirects, so a return value means failure.
      const result = await deleteDeck(deckId)
      if (result && !result.ok) toast.error(result.errors[0])
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        <Trash2Icon />
        Delete deck
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{title}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently deletes the deck and all of its cards. Anyone with
            the share link will no longer be able to open it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={confirmDelete}
          >
            {pending && <Loader2Icon className="animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
