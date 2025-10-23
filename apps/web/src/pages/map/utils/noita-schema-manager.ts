import { EntitySchema, parseEntitySchema } from '@noita-explorer/map';

export const noitaSchemaManager = (() => {
  const schemas: Record<string, Promise<EntitySchema>> = {};

  function hasSchema(hash: string) {
    return hash in schemas;
  }

  function downloadSchema(hash: string) {
    if (hasSchema(hash)) return;

    const schemaResponsePromise = fetch(`/schemas/${hash}.xml`)
      .then((response) => {
        if (!response.ok) {
          console.log('schema not ok', response);
          throw new Error('Could not find schema ' + hash);
        }
        return response.text();
      })
      .then((text) => parseEntitySchema(text));

    schemas[hash] = schemaResponsePromise;
  }

  async function getSchema(hash: string) {
    if (!hasSchema(hash)) {
      downloadSchema(hash);
    }

    return await schemas[hash];
  }

  return {
    getSchema,
  };
})();
