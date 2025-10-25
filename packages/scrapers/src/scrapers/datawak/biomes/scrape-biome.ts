import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { LuaWrapper } from '@noita-explorer/tools/lua';
import { NoitaBiome } from '@noita-explorer/model-noita';

export const scrapeBiome = async ({
  dataWakParentDirectoryApi,
  biomeFile,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  biomeFile: FileSystemFileAccess;
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

  let loadBgImage = true;

  const luaScriptPath = topologyTag.getAttribute('lua_script')?.asText();
  if (luaScriptPath) {
    const luaScriptFile =
      await dataWakParentDirectoryApi.getFile(luaScriptPath);
    const luaScriptText = await luaScriptFile.read.asText();
    const lua = LuaWrapper(luaScriptText);
    const initFunction = lua.findTopLevelFunctionDeclaration('init');

    if (initFunction) {
      loadBgImage = false;
    }
  }

  return {
    bgImagePath,
    bgImageEdgeLeft,
    bgImageEdgeRight,
    bgImageEdgeTop,
    bgImageEdgeBottom,
    bgImageEdgePriority,
    loadBgImage,
  };
};
