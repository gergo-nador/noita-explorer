import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { NoitaWandBonesFile } from '@noita-explorer/model-noita';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { scrapeWand } from '../../../common/wand/scrape-wand.ts';
import { noitaPaths } from '../../../../noita-paths.ts';

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

  const wands: NoitaWandBonesFile[] = [];

  for (const file of filteredFiles) {
    const text = await file.read.asText();
    const xmlObj = await parseXml(text);
    const xml = XmlWrapper(xmlObj);

    const entityTag = xml.findNthTag('Entity');
    if (entityTag === undefined) {
      continue;
    }

    const wand = scrapeWand({ wandXml: entityTag });
    if (wand === undefined) {
      continue;
    }

    const bonesFile: NoitaWandBonesFile = {
      fileName: file.getName(),
      wand: wand,
    };

    wands.push(bonesFile);
  }

  return wands;
};
