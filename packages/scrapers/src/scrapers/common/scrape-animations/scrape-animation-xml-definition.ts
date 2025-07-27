import { FileSystemFileAccess } from '@noita-explorer/model';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { parseAnimationXml } from './parse-animation-xml.ts';

export const scrapeAnimationXmlDefinition = async ({
  id,
  file,
}: {
  id: string;
  file: FileSystemFileAccess;
}) => {
  const xmlText = await file.read.asText();
  const parsedXml = await parseXml(xmlText);
  const xml = XmlWrapper(parsedXml);

  return parseAnimationXml({ xml, id });
};
