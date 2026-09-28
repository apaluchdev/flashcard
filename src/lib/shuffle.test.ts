import { describe, expect, it } from "vitest"

import { shuffle, shuffledOrder } from "./shuffle"

/** Deterministic PRNG (mulberry32) so tests are repeatable. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

describe("shuffle", () => {
  it("returns a new array with the same items and leaves the input alone", () => {
    const input = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8])
    const result = shuffle(input, seeded(1))

    expect(result).not.toBe(input)
    expect([...result].sort((a, b) => a - b)).toEqual([...input])
    expect(input).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it("handles empty and single-item arrays", () => {
    expect(shuffle([])).toEqual([])
    expect(shuffle(["only"])).toEqual(["only"])
  })

  it("places every item in every position with roughly equal frequency", () => {
    const random = seeded(42)
    const runs = 30_000
    const counts = Array.from({ length: 4 }, () => [0, 0, 0, 0])
    for (let run = 0; run < runs; run++) {
      shuffle([0, 1, 2, 3], random).forEach((item, position) => counts[item]![position]!++)
    }
    for (const row of counts) {
      for (const count of row) expect(count / runs).toBeCloseTo(0.25, 1)
    }
  })
})

describe("shuffledOrder", () => {
  it("is a permutation of 0..n-1", () => {
    const order = shuffledOrder(20, seeded(7))
    expect([...order].sort((a, b) => a - b)).toEqual(Array.from({ length: 20 }, (_, i) => i))
  })

  it("never returns the original order for 2+ items", () => {
    const random = seeded(3)
    for (let run = 0; run < 200; run++) {
      expect(shuffledOrder(2, random)).toEqual([1, 0])
    }
    // Even a `random` that always yields the identity shuffle gets rotated.
    expect(shuffledOrder(3, () => 0.999)).toEqual([1, 2, 0])
  })

  it("handles 0 and 1 items", () => {
    expect(shuffledOrder(0)).toEqual([])
    expect(shuffledOrder(1)).toEqual([0])
  })
})
