/** Fisher–Yates shuffle. Returns a new array; the input is not modified. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

/**
 * Shuffled indexes 0..length-1. For 2+ items it avoids returning the
 * unshuffled order, so pressing "Shuffle" visibly changes something even
 * for tiny decks.
 */
export function shuffledOrder(length: number, random: () => number = Math.random): number[] {
  const identity = Array.from({ length }, (_, i) => i)
  if (length < 2) return identity
  for (let attempt = 0; attempt < 10; attempt++) {
    const order = shuffle(identity, random)
    if (order.some((value, i) => value !== i)) return order
  }
  // Astronomically unlikely except with a broken `random`: rotate by one.
  return [...identity.slice(1), 0]
}
