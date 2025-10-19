export type KeySelector<T> = ((item: T) => string) | keyof T;

export function getKeySelectorValue<T>(item: T, keySelector: KeySelector<T>) {
  if (typeof keySelector === 'function') {
    return keySelector(item);
  }

  return item[keySelector];
}

export type KeyStringSelector<T> =
  | ((item: T) => string)
  | {
      [K in keyof T]: T[K] extends string ? K : never;
    }[keyof T];

export function getKeyStringSelectorValue<T>(
  item: T,
  keySelector: KeyStringSelector<T>,
): string {
  if (typeof keySelector === 'function') {
    return keySelector(item);
  }

  return item[keySelector] as string;
}

export type KeyNumberSelector<T> =
  | ((item: T) => number)
  | {
      [K in keyof T]: T[K] extends number ? K : never;
    }[keyof T];

export function getKeyNumberSelectorValue<T>(
  item: T,
  keySelector: KeyNumberSelector<T>,
): number {
  if (typeof keySelector === 'function') {
    return keySelector(item);
  }

  return item[keySelector] as number;
}
