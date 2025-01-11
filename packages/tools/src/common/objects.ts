const deepCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function proxiedPropertiesOf<TObj>(_obj?: TObj) {
  // https://stackoverflow.com/questions/33547583/safe-way-to-extract-property-names
  return new Proxy(
    {},
    {
      get: (_, prop) => prop,
      set: () => {
        throw Error('Set not supported');
      },
    },
  ) as {
    [P in keyof TObj]?: P;
  };
}

export const objectHelpers = {
  deepCopy,
  proxiedPropertiesOf,
};
