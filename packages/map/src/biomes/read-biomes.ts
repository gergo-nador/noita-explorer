import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';

interface Props {
  biomesAllFile: FileSystemFileAccess;
  dataWak: FileSystemDirectoryAccess;
}

export async function readBiomes({ biomesAllFile, dataWak }: Props) {
  const allBiomesText = await biomesAllFile.read.asText();
  const xmlObj = await parseXml(allBiomesText);
  const xml = XmlWrapper(xmlObj);

  const biomesToLoadTag = xml.findNthTag('BiomesToLoad');
  if (!biomesToLoadTag) {
    throw new Error('Expected BiomesToLoad tag to be found.');
  }

  //const biomeImageMapPath = biomesToLoadTag
  //  .getRequiredAttribute('biome_image_map')
  //  .asText();

  const biomeTags = biomesToLoadTag.findTagArray('Biome');

  for (const biomeTag of biomeTags) {
    //const color = biomeTag.getRequiredAttribute('color').asText();

    const biomeFileName = biomeTag
      .getRequiredAttribute('biome_filename')
      .asText();

    const biomeFile = await dataWak.getFile(biomeFileName);
    const biomeText = await biomeFile.read.asText();
    const biomeXmlObj = await parseXml(biomeText);
    const biomeXml = XmlWrapper(biomeXmlObj);

    const topologyTag = biomeXml.findNthTag('Topology');
    if (!topologyTag) continue;

    const bgImagePath = topologyTag.getAttribute('background_image')?.asText();
    console.log(bgImagePath);
  }
}
