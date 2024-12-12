import { NoitaProgressEntity } from './NoitaProgressEntity';

export interface NoitaEnemy extends NoitaProgressEntity {
  id: string;
  name: string;
  imageBase64: string;
}
