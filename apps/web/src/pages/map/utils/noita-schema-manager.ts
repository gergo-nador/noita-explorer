import { NoitaEntitySchema } from '@noita-explorer/model-noita';
import { scrape } from '@noita-explorer/scrapers';

export const noitaSchemaManager = (() => {
  const schemas: Record<string, Promise<NoitaEntitySchema>> = {};

  function hasSchema(hash: string) {
    return hash in schemas;
  }

  function downloadSchema(hash: string) {
    if (hasSchema(hash)) return;

    const url = `${import.meta.env.VITE_SCHEMA_URL}/${hash}.xml`;
    const schemaResponsePromise = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not find schema ' + hash);
        }
        return response.text();
      })
      .then((text) => scrape.entitySchema({ xmlText: text }));

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
