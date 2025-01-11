import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { NoitaWandConfig } from '@noita-explorer/model-noita';
import { LuaWrapper } from '@noita-explorer/tools/lua';
import { noitaPaths } from '../NoitaPaths.ts';

export const scrapeWandConfigs = async ({
  dataWakParentDirectoryApi,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}) => {
  const wandListLuaScriptPath = await dataWakParentDirectoryApi.path.join(
    noitaPaths.noitaDataWak.luaScripts.wands,
  );
  const wandListLuaScriptFile = await dataWakParentDirectoryApi.getFile(
    wandListLuaScriptPath,
  );
  const text = await wandListLuaScriptFile.read.asText();
  const luaWrapper = LuaWrapper(text);

  const wandListStatement = luaWrapper
    .findTopLevelAssignmentStatement('wands')
    .first();

  const luaWandsArray = wandListStatement.asArrayObjectDeclarationList();
  const wandConfigs: NoitaWandConfig[] = [];

  for (const luaWandConfig of luaWandsArray) {
    const name = luaWandConfig.getRequiredField('name').required.asString();

    const sprite = luaWandConfig.getRequiredField('file').required.asString();

    const spriteSplit = sprite.split('/');
    const imagePath = await dataWakParentDirectoryApi.path.join(spriteSplit);
    const imageFile = await dataWakParentDirectoryApi.getFile(imagePath);
    const imageBase64 = await imageFile.read.asImageBase64();

    const spriteFileName = spriteSplit[spriteSplit.length - 1];
    const spriteId = spriteFileName.split('.')[0];

    const wandConfig: NoitaWandConfig = {
      name: name,
      imageBase64: imageBase64,
      spriteId: spriteId,

      gripX: luaWandConfig.getRequiredField('grip_x').required.asNumber(),
      gripY: luaWandConfig.getRequiredField('grip_y').required.asNumber(),
      tipX: luaWandConfig.getRequiredField('tip_x').required.asNumber(),
      tipY: luaWandConfig.getRequiredField('tip_y').required.asNumber(),
    };

    wandConfigs.push(wandConfig);
  }

  return wandConfigs;
};
