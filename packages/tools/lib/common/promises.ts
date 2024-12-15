export const resolvePromise = <T>(val: T): Promise<T> => {
  return new Promise<T>((resolve) => resolve(val));
};

export const resolveCallbackPromise = <T>(callback: () => T): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    try {
      const result = callback();
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
