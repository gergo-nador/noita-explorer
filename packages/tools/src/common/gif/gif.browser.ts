import { CreateGifReturnType, GifHelpersType } from './gif.types.ts';
import { throwHelpers } from '../throw.ts';

async function createGif(): Promise<CreateGifReturnType> {
  return throwHelpers.notImplementedInCurrentEnvironment(createGif);
}

export const gifHelper: GifHelpersType = { createGif };
