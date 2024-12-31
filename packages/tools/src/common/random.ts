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

export const randomHelpers = {
  randomInt: randomInt,
  randomPick: randomPick,
};
