import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { NoitaBiome } from '@noita-explorer/model-noita';

export const scrapeBiome = async ({
  biomeFile,
  color,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  biomeFile: FileSystemFileAccess;
  color: string;
}): Promise<NoitaBiome | undefined> => {
  const biomeText = await biomeFile.read.asText();
  const biomeXmlObj = await parseXml(biomeText);
  const biomeXml = XmlWrapper(biomeXmlObj);

  const topologyTag = biomeXml.findNthTag('Topology');
  if (!topologyTag) return undefined;

  const bgImagePath = topologyTag.getAttribute('background_image')?.asText();
  const bgImageEdgeLeft = topologyTag
    .getAttribute('background_edge_left')
    ?.asText();
  const bgImageEdgeRight = topologyTag
    .getAttribute('background_edge_right')
    ?.asText();
  const bgImageEdgeTop = topologyTag
    .getAttribute('background_edge_top')
    ?.asText();
  const bgImageEdgeBottom = topologyTag
    .getAttribute('background_edge_bottom')
    ?.asText();

  const bgImageEdgePriority = topologyTag
    .getAttribute('background_edge_priority')
    ?.asInt();

  const limitBackgroundImage =
    topologyTag.getAttribute('limit_background_image')?.asBoolean() ?? true;

  const backgroundImageHeight = topologyTag
    .getAttribute('background_image_height')
    ?.asInt();

  const staticTileBgMask = topologyTag
    .getAttribute('static_tile_bg_mask')
    ?.asText();

  return {
    group: color,
    bgImagePath,
    bgImageEdgeLeft,
    bgImageEdgeRight,
    bgImageEdgeTop,
    bgImageEdgeBottom,
    bgImageEdgePriority,
    limitBackgroundImage,
    backgroundImageHeight,
    staticTile: staticTileBgMask
      ? {
          bgMask: staticTileBgMask,
          position: { x: 0, y: 0 },
          size: { x: 0, y: 0 },
        }
      : undefined,
  };
};
