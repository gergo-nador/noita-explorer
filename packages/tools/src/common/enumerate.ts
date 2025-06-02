const rangeTo = (to: number) => {
  return range(0, to);
};

const range = (from: number, to: number) => {
  if (from >= to) {
    return [];
  }

  const diff = to - from;
  const numbers = [...Array(diff).keys()];

  if (from === 0) {
    return numbers;
  }

  return numbers.map((number) => number + from);
};

export const enumerateHelpers = {
  rangeTo: rangeTo,
  range: range,
};
