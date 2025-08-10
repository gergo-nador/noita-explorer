import { NoitaScrapedGif } from './noita-scraped-gif.ts';

export type NoitaScrapedMedia = NoitaScrapedMediaGif | NoitaScrapedMediaImage;

export interface NoitaScrapedMediaGif {
  type: 'gif';
  gifs: NoitaScrapedGif[];
}

export interface NoitaScrapedMediaImage {
  type: 'image';
  imageType: 'default' | 'physics';
  imageBase64: string;
  width: number;
  height: number;
}
