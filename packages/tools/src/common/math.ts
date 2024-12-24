const round = (num: number, decimal = 0) => {
  const tens = Math.pow(10, decimal);
  return Math.round((num + Number.EPSILON) * tens) / tens;
};

const floor = (num: number, decimal = 0) => {
  const tens = Math.pow(10, decimal);
  return Math.floor((num + Number.EPSILON) * tens) / tens;
};

const randomInt = (lower: number, upper: number) => {
  return Math.floor(Math.random() * (upper - lower) + lower);
};

export const mathHelpers = {
  round: round,
  floor: floor,
  randomInt: randomInt,
};
