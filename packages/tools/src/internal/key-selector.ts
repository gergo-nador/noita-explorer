export type KeySelector<T> = ((item: T) => string) | keyof T;

export function getKeySelectorValue<T>(item: T, keySelector: KeySelector<T>) {
  if (typeof keySelector === 'function') {
    return keySelector(item);
  }

  return item[keySelector];
}

type OnlyStringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
};
export type KeyStringSelector<T> =
  | ((item: T) => string)
  | OnlyStringKeys<T>[keyof T];

export function getKeyStringSelectorValue<T>(
  item: T,
  keySelector: KeyStringSelector<T>,
): string {
  return getKeySelectorValue(item, keySelector) as string;
}

type OnlyNumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
};
export type KeyNumberSelector<T> =
  | ((item: T) => number)
  | OnlyNumberKeys<T>[keyof T];

export function getKeyNumberSelectorValue<T>(
  item: T,
  keySelector: KeyNumberSelector<T>,
): number {
  return getKeySelectorValue(item, keySelector as KeySelector<T>) as number;
}
