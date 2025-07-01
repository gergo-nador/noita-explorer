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

const reject = <T>(error: string): Promise<T> =>
  new Promise((_resolve, reject) => {
    reject(error);
  });

const fromCallbackProvider = <T>(func: (callback: (t?: T) => void) => void) => {
  return new Promise<T | undefined>((resolve) => {
    const callback = (t?: T) => resolve(t);
    func(callback);
  });
};

export const promiseHelper = {
  fromValue: fromValue,
  fromCallback: fromCallback,
  reject,
  fromCallbackProvider,
};
