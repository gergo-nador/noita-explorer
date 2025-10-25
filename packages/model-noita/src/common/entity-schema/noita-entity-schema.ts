import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaEntitySchemaComponent } from './noita-entity-schema-component.ts';

export interface NoitaEntitySchema {
  hash: string;
  components: StringKeyDictionary<NoitaEntitySchemaComponent>;
}
