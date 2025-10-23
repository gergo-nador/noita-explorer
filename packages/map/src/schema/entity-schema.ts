import { StringKeyDictionary } from '@noita-explorer/model';

export interface EntitySchema {
  hash: string;
  components: StringKeyDictionary<EntitySchemaComponent>;
}

export interface EntitySchemaComponent {
  name: string;
  variables: EntitySchemaComponentVariable[];
}

export interface EntitySchemaComponentVariable {
  name: string;
  size: number;
  type: string;
}
