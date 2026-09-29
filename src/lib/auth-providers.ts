// OAuth providers are enabled only when both of their keys are set, so the
// app runs (and explains what's missing) with GitHub only, Google only, or
// neither configured.

export const PROVIDERS = {
  github: { label: "GitHub", env: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"] },
  google: { label: "Google", env: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"] },
} as const

export type Provider = keyof typeof PROVIDERS

function credentials(provider: Provider) {
  const [idVar, secretVar] = PROVIDERS[provider].env
  const clientId = process.env[idVar]?.trim()
  const clientSecret = process.env[secretVar]?.trim()
  return clientId && clientSecret ? { clientId, clientSecret } : null
}

/** Providers whose client id and secret are both configured. */
export function enabledProviders(): Provider[] {
  return (Object.keys(PROVIDERS) as Provider[]).filter((provider) => credentials(provider))
}

/** Better Auth `socialProviders` config for the enabled providers. */
export function socialProvidersConfig() {
  return Object.fromEntries(
    enabledProviders().map((provider) => [provider, credentials(provider)!])
  ) as Partial<Record<Provider, { clientId: string; clientSecret: string }>>
}
