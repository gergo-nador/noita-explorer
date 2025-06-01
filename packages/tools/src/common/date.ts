const getNextUpcomingDate = (
  calculateDateForYear: (year: number) => Date | undefined,
) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const date = calculateDateForYear(currentYear);

  if (!date) {
    return;
  }

  if (date.getTime() > now.getTime()) {
    return date;
  }

  return calculateDateForYear(currentYear + 1);
};

function calculateEaster(Y: number) {
  // https://stackoverflow.com/questions/1284314/easter-date-in-javascript
  const C = Math.floor(Y / 100);
  const N = Y - 19 * Math.floor(Y / 19);
  const K = Math.floor((C - 17) / 25);
  let I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
  I = I - 30 * Math.floor(I / 30);
  I =
    I -
    Math.floor(I / 28) *
      (1 -
        Math.floor(I / 28) *
          Math.floor(29 / (I + 1)) *
          Math.floor((21 - N) / 11));
  let J = Y + Math.floor(Y / 4) + I + 2 - C + Math.floor(C / 4);
  J = J - 7 * Math.floor(J / 7);
  const L = I - J;
  const M = 3 + Math.floor((L + 40) / 44);
  const D = L + 28 - 31 * Math.floor(M / 4);

  return new Date(Y, M - 1, D);
}

const getFirstDayOfWeek = (dayOfWeek: number) => {
  return {
    between: (d1: Date, d2: Date) => {
      const counter = new Date(d1.getTime());
      while (counter.getTime() < d2.getTime()) {
        if (counter.getDay() === dayOfWeek) {
          return counter;
        }

        counter.setDate(counter.getDate() + 1);
      }

      return undefined;
    },
  };
};

const convertFunction = (milliSeconds: number) => {
  return {
    toDays: () => milliSeconds / (1000 * 60 * 60 * 24),
  };
};

const convert = {
  milliSeconds: (ms: number) => convertFunction(ms),
};

export const dateHelpers = {
  calculateEaster,
  getFirstDayOfWeek,
  getNextUpcomingDate,
  convert,
};
