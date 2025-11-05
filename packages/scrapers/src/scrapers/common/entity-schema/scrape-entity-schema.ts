import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { arrayHelpers } from '@noita-explorer/tools';
import {
  NoitaEntitySchema,
  NoitaEntitySchemaComponent,
  NoitaEntitySchemaComponentVariable,
} from '@noita-explorer/model-noita';

export async function scrapeEntitySchema({
  xmlText,
}: {
  xmlText: string;
}): Promise<NoitaEntitySchema> {
  const xmlRoot = await parseXml(xmlText);
  const xml = XmlWrapper(xmlRoot);

  const schemaTag = xml.findNthTag('Schema');
  if (!schemaTag) {
    throw new Error('Invalid schema: no schema tag provided');
  }

  const hash = schemaTag.getRequiredAttribute('hash').asText();

  const componentTags = schemaTag.findTagArray('Component');
  const componentsArray = componentTags.map(
    (componentTag): NoitaEntitySchemaComponent => {
      const name = componentTag.getRequiredAttribute('component_name').asText();

      const varTags = componentTag.findTagArray('Var');
      const vars = varTags.map((varTag): NoitaEntitySchemaComponentVariable => {
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
