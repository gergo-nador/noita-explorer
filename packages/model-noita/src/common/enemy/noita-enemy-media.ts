import { StringKeyDictionary } from '@noita-explorer/model';

export type NoitaEnemyMedia = NoitaEnemyGifMedia | NoitaEnemyImageMedia;

export interface NoitaEnemyGifMedia {
  type: 'gif';
  gifs: StringKeyDictionary<NoitaEnemyGif>;
}

export interface NoitaEnemyGif {
  name: string;
  frameCount: number;
  frameWait: number;
  frameHeight: number;
  frameWidth: number;
  loop: boolean;
}

export interface NoitaEnemyImageMedia {
  type: 'image';
  imageType: 'physics';
}
