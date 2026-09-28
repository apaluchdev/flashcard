import { describe, expect, it } from "vitest"

import { safeRedirectPath } from "./safe-redirect"

describe("safeRedirectPath", () => {
  it("keeps same-site paths", () => {
    expect(safeRedirectPath("/decks/new")).toBe("/decks/new")
    expect(safeRedirectPath("/decks?scope=mine")).toBe("/decks?scope=mine")
  })

  it("falls back for missing values", () => {
    expect(safeRedirectPath(undefined)).toBe("/decks")
    expect(safeRedirectPath("")).toBe("/decks")
    expect(safeRedirectPath(null, "/")).toBe("/")
  })

  it("rejects absolute and protocol-relative URLs", () => {
    expect(safeRedirectPath("https://evil.example")).toBe("/decks")
    expect(safeRedirectPath("//evil.example")).toBe("/decks")
    expect(safeRedirectPath("/\\evil.example")).toBe("/decks")
    expect(safeRedirectPath("javascript:alert(1)")).toBe("/decks")
  })
})
