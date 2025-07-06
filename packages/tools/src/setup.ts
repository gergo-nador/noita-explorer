import { setupImages } from './common/images.ts';

// @ts-expect-error agjang akfna
export const toolsSetup = ({ canvas }) => {
  setupImages({ canvas });
};
