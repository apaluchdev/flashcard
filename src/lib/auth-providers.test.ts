import { afterEach, describe, expect, it, vi } from "vitest"

import { enabledProviders, socialProvidersConfig } from "./auth-providers"

afterEach(() => {
  vi.unstubAllEnvs()
})

function setKeys(keys: Record<string, string>) {
  for (const name of [
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ]) {
    vi.stubEnv(name, keys[name] ?? "")
  }
}

describe("enabledProviders", () => {
  it("enables nothing when no keys are set", () => {
    setKeys({})
    expect(enabledProviders()).toEqual([])
    expect(socialProvidersConfig()).toEqual({})
  })

  it("needs both the id and the secret", () => {
    setKeys({ GITHUB_CLIENT_ID: "id", GOOGLE_CLIENT_SECRET: "secret" })
    expect(enabledProviders()).toEqual([])
  })

  it("ignores whitespace-only values", () => {
    setKeys({ GITHUB_CLIENT_ID: "  ", GITHUB_CLIENT_SECRET: "secret" })
    expect(enabledProviders()).toEqual([])
  })

  it("enables each fully configured provider", () => {
    setKeys({ GOOGLE_CLIENT_ID: "gid", GOOGLE_CLIENT_SECRET: "gsecret" })
    expect(enabledProviders()).toEqual(["google"])
    expect(socialProvidersConfig()).toEqual({
      google: { clientId: "gid", clientSecret: "gsecret" },
    })

    setKeys({
      GITHUB_CLIENT_ID: "hid",
      GITHUB_CLIENT_SECRET: "hsecret",
      GOOGLE_CLIENT_ID: "gid",
      GOOGLE_CLIENT_SECRET: "gsecret",
    })
    expect(enabledProviders()).toEqual(["github", "google"])
  })
})
