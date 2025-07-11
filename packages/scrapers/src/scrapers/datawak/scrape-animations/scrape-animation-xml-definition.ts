import { FileSystemFileAccess } from '@noita-explorer/model';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { parseAnimationXml } from './parse-animation-xml.ts';

export const scrapeAnimationXmlDefinition = async ({
  id,
  animationsFiles,
}: {
  id: string;
  animationsFiles: FileSystemFileAccess[];
}) => {
  const xmlFilePath = id + '.xml';
  const xmlFile = animationsFiles.find(
    (file) => file.getName() === xmlFilePath,
  );

  if (!xmlFile) {
    return undefined;
  }

  const xmlText = await xmlFile.read.asText();
  const parsedXml = await parseXml(xmlText);
  const xml = XmlWrapper(parsedXml);

  return parseAnimationXml({ xml, id });
};
