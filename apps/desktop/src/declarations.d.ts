declare module 'copy-paste' {
  const value: {
    copy: (text: string, callback?: (err: unknown) => void) => void;
    paste: (callback: (err: unknown, text: string) => void) => void;
  };
  export = value;
}
