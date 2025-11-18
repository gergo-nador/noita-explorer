import { NoitaMaterial } from '../../../common/noita-material.ts';

export type NoitaScrapedMaterial = Omit<NoitaMaterial, 'hasGraphicsImage'> & {
  imageBase64: string | undefined;
};
