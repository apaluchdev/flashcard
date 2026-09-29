"use client"

import { useState } from "react"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { GitHubIcon, GoogleIcon } from "@/components/provider-icons"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import type { Provider } from "@/lib/auth-providers"

const buttons: { id: Provider; label: string; Icon: typeof GitHubIcon }[] = [
  { id: "github", label: "Continue with GitHub", Icon: GitHubIcon },
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
]

export function SignInButtons({
  callbackURL,
  providers,
}: {
  callbackURL: string
  /** Providers configured on the server; others are hidden. */
  providers: Provider[]
}) {
  const [pending, setPending] = useState<Provider | null>(null)

  async function signIn(provider: Provider) {
    setPending(provider)
    // On success the browser navigates away to the provider.
    const { error } = await authClient.signIn.social({ provider, callbackURL })
    if (error) {
      toast.error(error.message ?? "Sign-in failed. Please try again.")
      setPending(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {buttons
        .filter(({ id }) => providers.includes(id))
        .map(({ id, label, Icon }) => (
        <Button
          key={id}
          variant="outline"
          size="lg"
          className="h-11"
          disabled={pending !== null}
          onClick={() => signIn(id)}
        >
          {pending === id ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <Icon className="size-4" />
          )}
          {label}
        </Button>
      ))}
    </div>
  )
}
