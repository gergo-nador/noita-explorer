const fromValue = <T>(val: T): Promise<T> => {
  return new Promise<T>((resolve) => resolve(val));
};

const fromCallback = <T>(callback: () => T): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    try {
      const result = callback();
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

export const promiseHelper = {
  fromValue: fromValue,
  fromCallback: fromCallback,
};
