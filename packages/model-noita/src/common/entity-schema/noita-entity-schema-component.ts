import { NoitaEntitySchemaComponentVariable } from './noita-entity-schema-component-variable.ts';

export interface NoitaEntitySchemaComponent {
  name: string;
  variables: NoitaEntitySchemaComponentVariable[];
}
