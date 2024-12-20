export const round = (num: number, decimal = 0) => {
  const tens = Math.pow(10, decimal);
  return Math.round((num + Number.EPSILON) * tens) / tens;
};

export const floor = (num: number, decimal = 0) => {
  const tens = Math.pow(10, decimal);
  return Math.floor((num + Number.EPSILON) * tens) / tens;
};

export const randomInt = (lower: number, upper: number) => {
  return Math.floor(Math.random() * (upper - lower) + lower);
};
