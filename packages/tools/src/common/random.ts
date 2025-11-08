const randomInt = (lower: number, upper: number) => {
  return Math.floor(Math.random() * (upper - lower) + lower);
};

const randomPick = <T>(items: T[]): T => {
  if (items.length === 0) {
    throw new Error('Cannot pick randomly from array: no items in the array');
  }

  const index = randomInt(0, items.length);
  return items[index];
};

/**
 * Returns true based on the given probability (0 <= n <= 1).
 * @param n The probability of returning true.
 * @example
 * ```ts
 * // has a 1% chance of returning true
 * chance(0.01);
 * ```
 */
export function chance(n: number): boolean {
  if (n <= 0) return false;
  if (n >= 1) return true;
  return Math.random() < n;
}

export const randomHelpers = {
  randomInt: randomInt,
  randomPick: randomPick,
  chance,
};
