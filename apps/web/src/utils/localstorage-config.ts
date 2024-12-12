export const localStorageConfig = () => {
  const storage = localStorage;
  const configName = 'config';

  storage[configName] ??= {};

  function get(key: string): string | undefined {
    let obj = storage[configName];

    const paths = key.split('.');
    for (const subPath of paths) {
      if (typeof obj !== 'object') return undefined;
      if (!(subPath in obj)) return undefined;
      obj = obj[subPath];
    }

    return obj;
  }

  function set(key: string, value: string) {
    let obj = storage[configName];

    const paths = key.split('.');
    const lastPath = paths.pop();

    if (lastPath === undefined) {
      throw new Error('key must not be empty');
    }

    for (const subPath of paths) {
      if (typeof obj[subPath] !== 'object') {
        obj[subPath] = {};
      }

      obj = obj[subPath];
    }

    obj[lastPath] = value;
  }

  return {
    get: get,
    set: set,
  };
};
