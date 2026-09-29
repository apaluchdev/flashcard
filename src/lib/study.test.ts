import { describe, expect, it } from "vitest"

import { buildOrder, countByFilter, matchesFilter, removeFromOrder } from "./study"

const cards = ["a", "b", "c", "d", "e"].map((id) => ({ id }))
const retired = new Set(["b", "d"])

describe("matchesFilter", () => {
  it("matches retired, unretired and all", () => {
    expect(matchesFilter(true, "retired")).toBe(true)
    expect(matchesFilter(false, "retired")).toBe(false)
    expect(matchesFilter(false, "unretired")).toBe(true)
    expect(matchesFilter(true, "unretired")).toBe(false)
    expect(matchesFilter(true, "all")).toBe(true)
    expect(matchesFilter(false, "all")).toBe(true)
  })
})

describe("buildOrder", () => {
  it("keeps the saved order within each filter", () => {
    expect(buildOrder(cards, retired, "all", false)).toEqual([0, 1, 2, 3, 4])
    expect(buildOrder(cards, retired, "unretired", false)).toEqual([0, 2, 4])
    expect(buildOrder(cards, retired, "retired", false)).toEqual([1, 3])
  })

  it("shuffles only the cards in the filter", () => {
    const order = buildOrder(cards, retired, "unretired", true)
    expect([...order].sort()).toEqual([0, 2, 4])
    expect(order).not.toEqual([0, 2, 4])
  })

  it("handles empty results", () => {
    expect(buildOrder(cards, new Set(), "retired", true)).toEqual([])
  })
})

describe("removeFromOrder", () => {
  const order = [4, 1, 3, 0]

  it("removing the current card shows the next one", () => {
    expect(removeFromOrder(order, 1, 1)).toEqual({ order: [4, 3, 0], position: 1, finished: false })
  })

  it("removing an earlier card keeps the same card on screen", () => {
    expect(removeFromOrder(order, 2, 0)).toEqual({ order: [1, 3, 0], position: 1, finished: false })
  })

  it("removing a later card doesn't move the viewer", () => {
    expect(removeFromOrder(order, 1, 3)).toEqual({ order: [4, 1, 3], position: 1, finished: false })
  })

  it("removing the last card while on it finishes the round", () => {
    expect(removeFromOrder(order, 3, 3)).toEqual({ order: [4, 1, 3], position: 2, finished: true })
  })

  it("removing the only card leaves an empty order", () => {
    expect(removeFromOrder([2], 0, 0)).toEqual({ order: [], position: 0, finished: false })
  })
})

describe("countByFilter", () => {
  it("counts each filter", () => {
    expect(countByFilter(cards, retired)).toEqual({ all: 5, retired: 2, unretired: 3 })
  })

  it("ignores retired ids that aren't in the deck", () => {
    expect(countByFilter(cards, new Set(["zzz"]))).toEqual({ all: 5, retired: 0, unretired: 5 })
  })
})
