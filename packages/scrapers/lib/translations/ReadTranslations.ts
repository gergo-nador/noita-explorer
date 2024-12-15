import {
  FileSystemFile,
  NoitaTranslation,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { parse } from 'csv-parse/browser/esm';

export const readTranslations = async ({
  translationFile,
}: {
  translationFile: FileSystemFile;
}): Promise<StringKeyDictionary<NoitaTranslation>> => {
  const csvText = await translationFile.read.asText();
  const translations: StringKeyDictionary<NoitaTranslation> = {};
  await new Promise((resolve, reject) => {
    parse(csvText, {
      delimiter: ',',
      columns: (headers) =>
        headers.map((val: string, index: number) => (index === 0 ? 'id' : val)), // Rename the first header to 'id'
      skip_empty_lines: true,
    })
      .on('data', (row: StringKeyDictionary<string>) => {
        // Build the translations object
        translations[row['id']] = {
          id: row['id'],
          en: row['en'],
        };
      })
      .on('end', (rowCount: number) => {
        resolve(`Row count: ${rowCount}`);
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  return translations;
};
