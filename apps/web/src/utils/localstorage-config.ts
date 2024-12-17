import { get, set } from 'idb-keyval';
import store from 'store2';

export const idbKeyValConfig = <T>() => {
  return {
    get: (key: string): Promise<T> => get(key),
    set: (key: string, value: T) => set(key, value),
  };
};

export const localStorageStore = () => {
  return {
    get: (key: string): string | undefined => store.get(key),
    set: (key: string, value: string) => store.set(key, value),
  };
};
