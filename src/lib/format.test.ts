import { describe, expect, it } from "vitest"

import { formatRelativeTime, pluralize } from "./format"

const now = new Date("2026-09-28T12:00:00Z")
const ago = (seconds: number) => new Date(now.getTime() - seconds * 1000)

describe("formatRelativeTime", () => {
  it.each([
    [10, "just now"],
    [5 * 60, "5 minutes ago"],
    [2 * 60 * 60, "2 hours ago"],
    [26 * 60 * 60, "yesterday"],
    [3 * 24 * 60 * 60, "3 days ago"],
    [15 * 24 * 60 * 60, "2 weeks ago"],
    [70 * 24 * 60 * 60, "2 months ago"],
    [800 * 24 * 60 * 60, "2 years ago"],
  ])("%i seconds ago → %s", (seconds, expected) => {
    expect(formatRelativeTime(ago(seconds), now)).toBe(expected)
  })
})

describe("pluralize", () => {
  it("handles one, many and thousands", () => {
    expect(pluralize(1, "card")).toBe("1 card")
    expect(pluralize(0, "card")).toBe("0 cards")
    expect(pluralize(1000, "card")).toBe("1,000 cards")
  })
})
