import { StringKeyDictionary } from '@noita-explorer/model';

export const groupBy = <T>(items: T[], by: (t: T) => string) => {
  const groups: StringKeyDictionary<T[]> = items.reduce(
    (groups, item) => {
      const val = by(item);

      if (!(val in groups)) {
        groups[val] = [];
      }

      groups[val].push(item);
      return groups;
    },
    {} as StringKeyDictionary<T[]>,
  );

  return {
    asArray: () => Object.values(groups),
    asDict: () => groups,
  };
};

export const maxBy = <T>(
  items: T[],
  by: (t: T) => number,
): { item: T | undefined; value: number } => {
  if (items.length === 0) {
    return {
      item: undefined,
      value: -Infinity,
    };
  }

  return items.reduce(
    (currentMax, item) => {
      const val = by(item);
      return currentMax.value > val ? currentMax : { item: item, value: val };
    },
    { item: items[0], value: -Infinity },
  );
};

export const minBy = <T>(
  items: T[],
  by: (t: T) => number,
): { item: T | undefined; value: number } => {
  if (items.length === 0) {
    return {
      item: undefined,
      value: -Infinity,
    };
  }

  return items.reduce(
    (currentMax, item) => {
      const val = by(item);
      return currentMax.value < val ? currentMax : { item: item, value: val };
    },
    { item: items[0], value: Infinity },
  );
};

export const sumBy = <T>(items: T[], by: (t: T) => number) => {
  return items.reduce((sum, item) => sum + by(item), 0);
};

export const avgBy = <T>(items: T[], by: (t: T) => number) => {
  if (items.length === 0) {
    return undefined;
  }

  const sum = sumBy(items, by);
  return sum / items.length;
};

export const toggleItemInList = <T>(list: T[], item: T) => {
  const copy = [...list];

  if (copy.includes(item)) {
    const index = copy.indexOf(item);
    copy.splice(index, 1);
    return copy;
  }

  copy.push(item);
  return copy;
};

export const asDict = <T>(
  items: T[],
  keySelector: (t: T) => string,
): StringKeyDictionary<T> => {
  const dict: StringKeyDictionary<T> = {};

  for (const item of items) {
    const key = keySelector(item);
    dict[key] = item;
  }

  return dict;
};
