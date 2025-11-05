interface FastLZModule {
  fastlz_decompress(
    ptr: number,
    size: number,
    outputPtr: number,
    outputSize: number,
  ): number;
}

type JsToCType<T> = T extends number
  ? 'number'
  : T extends string
    ? 'string'
    : T extends boolean
      ? 'boolean'
      : never;

type ParamsToCTypes<T extends readonly any[]> = {
  [K in keyof T]: JsToCType<T[K]>;
};

type CWrap = <K extends keyof FastLZModule, F extends FastLZModule[K]>(
  funcName: K,
  returnType: F extends (...args: any[]) => infer R ? JsToCType<R> : never,
  argTypes: F extends (...args: infer P) => any ? ParamsToCTypes<P> : never,
) => F;

export interface ImportModule extends FastLZModule {
  _malloc(size: number): number;
  _free(ptr: number): void;
  HEAPU8: Uint8Array;
  cwrap: CWrap;
}

export default function createModule(): Promise<ImportModule>;
