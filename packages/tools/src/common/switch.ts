export const switchStatement = <T extends string | number | symbol>(key: T) => {
  return {
    cases: <U>(args: KeyDictionary<T, U>) => getValue(args, key),
  };
};

const getValue = <Key extends string | number | symbol, Value>(
  args: KeyDictionary<Key, Value>,
  key: Key,
): Value | undefined => {
  if (key in args) {
    return args[key];
  }

  if ('__default' in args) {
    return args['__default'];
  }

  return undefined;
};

export type KeyDictionary<Key extends string | number | symbol, Value> = {
  [k in Key | '__default']?: Value;
};
