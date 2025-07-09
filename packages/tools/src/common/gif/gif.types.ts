export interface CreateGifOptionsType {
  frames: string[];
  delayMs: number;
  /**
   * - `undefined`: play once, no repeat
   * - `0`: repeat infinitely
   * - `x` (>0): repeat x times
   */
  repeat: number | undefined;
}

export interface CreateGifReturnType {
  buffer: Uint8Array;
}

export interface GifHelpersType {
  createGif: (options: CreateGifOptionsType) => Promise<CreateGifReturnType>;
}
