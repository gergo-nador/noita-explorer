import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { EntityMediaStructure } from '@noita-explorer/model-noita';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { mergeXmlBaseFiles } from '../../common/merge-xml-base-files.ts';
import { scrapeEntityMediaXml } from './scrape-entity-media-xml.ts';

interface Props {
  file: FileSystemFileAccess;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}

export async function scrapeEntityMediaFile({
  file,
  dataWakParentDirectoryApi,
}: Props): Promise<EntityMediaStructure | undefined> {
  if (!file.getName().endsWith('.xml')) return;

  const xmlText = await file.read.asText();
  const parsedXml = await parseXml(xmlText);
  const xml = XmlWrapper(parsedXml);

  const rootEntity = xml.getChild('Entity');
  if (!rootEntity) return;

  const { entityXml } = await mergeXmlBaseFiles({
    file,
    dataWakParentDirectoryApi,
  });

  const entityMediaStructure = await scrapeEntityMediaXml({
    xml: entityXml,
    dataWakParentDirectoryApi,
  });

  return entityMediaStructure;
}
