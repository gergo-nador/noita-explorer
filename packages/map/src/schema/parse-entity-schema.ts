import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import {
  EntitySchema,
  EntitySchemaComponent,
  EntitySchemaComponentVariable,
} from './entity-schema.ts';
import { arrayHelpers } from '@noita-explorer/tools';

export async function parseEntitySchema(text: string): Promise<EntitySchema> {
  const xmlRoot = await parseXml(text);
  const xml = XmlWrapper(xmlRoot);

  const schemaTag = xml.findNthTag('Schema');
  if (!schemaTag) {
    throw new Error('Invalid schema: no schema tag provided');
  }

  const hash = schemaTag.getRequiredAttribute('hash').asText();

  const componentTags = schemaTag.findTagArray('Component');
  const componentsArray = componentTags.map(
    (componentTag): EntitySchemaComponent => {
      const name = componentTag.getRequiredAttribute('component_name').asText();

      const varTags = componentTag.findTagArray('Var');
      const vars = varTags.map((varTag): EntitySchemaComponentVariable => {
        const name = varTag.getRequiredAttribute('name').asText();
        const size = varTag.getRequiredAttribute('size').asInt();
        const type = varTag.getRequiredAttribute('type').asText();

        return {
          name,
          size,
          type,
        };
      });

      return { name, variables: vars };
    },
  );

  const componentsDict = arrayHelpers.asDict(
    componentsArray,
    (component) => component.name,
  );

  return {
    hash,
    components: componentsDict,
  };
}
