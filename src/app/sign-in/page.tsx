import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { SignInButtons } from "@/components/sign-in-buttons"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { safeRedirectPath } from "@/lib/safe-redirect"
import { getCurrentUser } from "@/server/session"

export const metadata: Metadata = { title: "Sign in" }

export default async function SignInPage({
  searchParams,
}: PageProps<"/sign-in">) {
  const { next } = await searchParams
  const callbackURL = safeRedirectPath(typeof next === "string" ? next : null)

  if (await getCurrentUser()) redirect(callbackURL)

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>
            Sign in to create, edit and share your flashcard decks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButtons callbackURL={callbackURL} />
        </CardContent>
      </Card>
    </div>
  )
}
