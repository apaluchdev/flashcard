import { shuffledOrder } from "@/lib/shuffle"

// Pure helpers behind the study viewer's filter/shuffle/retire behavior.

export const CARD_FILTERS = ["unretired", "retired", "all"] as const
export type CardFilter = (typeof CARD_FILTERS)[number]

export function matchesFilter(retired: boolean, filter: CardFilter) {
  return filter === "all" || (filter === "retired") === retired
}

/**
 * Indexes (into `cards`) to study for a filter: saved order, or shuffled.
 * Shuffling never returns the saved order for 2+ cards.
 */
export function buildOrder(
  cards: readonly { id: string }[],
  retired: ReadonlySet<string>,
  filter: CardFilter,
  shuffle: boolean,
  random: () => number = Math.random
) {
  const indexes = cards.flatMap((card, i) => (matchesFilter(retired.has(card.id), filter) ? [i] : []))
  return shuffle ? shuffledOrder(indexes.length, random).map((i) => indexes[i]!) : indexes
}

/**
 * Removes the card at `removedAt` from the study order and returns where the
 * viewer should be. `finished` means the removed card was the last one left
 * after the current position.
 */
export function removeFromOrder(order: readonly number[], position: number, removedAt: number) {
  const next = order.filter((_, i) => i !== removedAt)
  let nextPosition = removedAt < position ? position - 1 : position
  const finished = next.length > 0 && nextPosition >= next.length
  if (nextPosition >= next.length) nextPosition = Math.max(0, next.length - 1)
  return { order: next, position: nextPosition, finished }
}

export function countByFilter(cards: readonly { id: string }[], retired: ReadonlySet<string>) {
  const retiredCount = cards.filter((card) => retired.has(card.id)).length
  return { all: cards.length, retired: retiredCount, unretired: cards.length - retiredCount }
}
