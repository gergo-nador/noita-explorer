import Store from 'electron-store';

const store = new Store({
  name: 'config',
  watch: true,
});

export const getConfig = (
  key: string,
): object | number | string | boolean | undefined => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return store.get(key);
};

export const setConfig = (
  key: string,
  value: object | number | string | boolean,
) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  store.set(key, value);
};
