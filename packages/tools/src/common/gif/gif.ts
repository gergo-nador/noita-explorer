import { CreateGifOptionsType, GifHelpersType } from './gif.types.ts';
import { runtimeEnvironment } from '../runtime-environment.ts';

async function getGifHelper() {
  const importStatement = await runtimeEnvironment.pick({
    node: () => import('./gif.node.ts'),
    browser: () => import('./gif.browser.ts'),
  });
  return importStatement.gifHelper;
}

async function createGif(options: CreateGifOptionsType) {
  const gifHelper = await getGifHelper();
  return await gifHelper.createGif(options);
}

export const gifHelpers: GifHelpersType = { createGif };
