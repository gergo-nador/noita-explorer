export type KeySelector<T> = ((item: T) => string) | keyof T;

export function getKeySelectorValue<T>(item: T, keySelector: KeySelector<T>) {
  if (typeof keySelector === 'function') {
    return keySelector(item);
  }

  return item[keySelector];
}

export type OnlyStringKeys<T> = {
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

export type OnlyNumberKeys<T> = {
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

export type ObjectKey = string | number;
export type OnlyObjectKeys<T> = {
  [K in keyof T]: T[K] extends ObjectKey ? K : never;
};
export type ObjectKeySelector<T> =
  | ((item: T) => ObjectKey)
  | OnlyObjectKeys<T>[keyof T];

export function getObjectKeySelectorValue<T>(
  item: T,
  keySelector: ObjectKeySelector<T>,
): ObjectKey {
  return getKeySelectorValue(item, keySelector as KeySelector<T>) as ObjectKey;
}
