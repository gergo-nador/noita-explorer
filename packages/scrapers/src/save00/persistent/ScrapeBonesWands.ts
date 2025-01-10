import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { NoitaWand } from '@noita-explorer/model-noita';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { __scrapeWand } from '../ScrapeWand.ts';
import { noitaPaths } from '../../NoitaPaths.ts';

export const scrapeBonesWands = async ({
  save00DirectoryApi,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
}) => {
  const bonesDirPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.bones_new,
  );
  const bonesDir = await save00DirectoryApi.getDirectory(bonesDirPath);
  const files = await bonesDir.listFiles();
  const filteredFiles = files.filter((f) => f.getName().endsWith('.xml'));

  const wands: NoitaWand[] = [];

  for (const file of filteredFiles) {
    const text = await file.read.asText();
    const xmlObj = await parseXml(text);
    const xml = XmlWrapper(xmlObj);

    const entityTag = xml.findNthTag('Entity');
    if (entityTag === undefined) {
      continue;
    }

    const wand = __scrapeWand(entityTag);
    if (wand === undefined) {
      continue;
    }

    wands.push(wand);
  }

  return wands;
};
