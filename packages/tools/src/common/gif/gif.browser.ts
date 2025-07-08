import { CreateGifReturnType, GifHelpersType } from './gif.types.ts';

async function createGif(): Promise<CreateGifReturnType> {
  throw new Error('createGif is not implemented for browser environment');
}

export const gifHelper: GifHelpersType = { createGif };
