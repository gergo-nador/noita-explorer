import { StringKeyDictionary } from '@noita-explorer/model';

const mapDictionary = <T, U>(
  value: StringKeyDictionary<T>,
  callback: (key: string, t: T) => U,
): U[] => {
  const results: U[] = [];

  for (const key of Object.keys(value)) {
    const val = value[key];
    const result = callback(key, val);
    results.push(result);
  }

  return results;
};

export const dictionaryHelpers = {
  mapDictionary: mapDictionary,
};
