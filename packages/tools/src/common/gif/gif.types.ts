export interface CreateGifOptionsType {
  frames: string[];
  delayMs: number;
  repeat: boolean;
}

export interface CreateGifReturnType {
  buffer: Uint8Array;
}

export interface GifHelpersType {
  createGif: (options: CreateGifOptionsType) => Promise<CreateGifReturnType>;
}
