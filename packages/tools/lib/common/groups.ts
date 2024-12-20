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
