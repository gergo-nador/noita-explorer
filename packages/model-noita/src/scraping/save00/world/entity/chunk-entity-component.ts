import { StringKeyDictionary } from '@noita-explorer/model';

export interface ChunkEntityComponent {
  name: string;
  deleted: boolean;
  enabled: boolean;
  tags: string;
  data: StringKeyDictionary<unknown>;
}
