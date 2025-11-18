import { DataWakMediaIndex } from '../media/data-wak-media-index.ts';

export interface EntityMediaStructure {
  media: DataWakMediaIndex[];
  entities: EntityMediaStructure[];
}
