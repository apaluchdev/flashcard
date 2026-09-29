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
import { enabledProviders } from "@/lib/auth-providers"
import { safeRedirectPath } from "@/lib/safe-redirect"
import { getCurrentUser } from "@/server/session"

export const metadata: Metadata = { title: "Sign in" }

export default async function SignInPage({
  searchParams,
}: PageProps<"/sign-in">) {
  const { next } = await searchParams
  const callbackURL = safeRedirectPath(typeof next === "string" ? next : null)

  if (await getCurrentUser()) redirect(callbackURL)
  const providers = enabledProviders()

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
          {providers.length > 0 ? (
            <SignInButtons callbackURL={callbackURL} providers={providers} />
          ) : (
            <div
              role="alert"
              className="flex flex-col gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground"
            >
              <p className="font-medium text-foreground">Sign-in isn&apos;t set up yet</p>
              <p>
                Add OAuth keys for GitHub (<code>GITHUB_CLIENT_ID</code>,{" "}
                <code>GITHUB_CLIENT_SECRET</code>) and/or Google (<code>GOOGLE_CLIENT_ID</code>,{" "}
                <code>GOOGLE_CLIENT_SECRET</code>) to <code>.env</code>, then restart the app. See
                the README for step-by-step instructions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
