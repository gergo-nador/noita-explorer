import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { NoitaScrapedWandConfig } from '@noita-explorer/model-noita';
import { fileSystemAccessHelpers, arrayHelpers } from '@noita-explorer/tools';
import { LuaWrapper } from '@noita-explorer/tools/lua';
import { noitaPaths } from '../../noita-paths.ts';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { splitNoitaEntityTags } from '../common/tags.ts';
import { mergeXmlBaseFiles } from './scrape-enemies/merge-xml-base-files.ts';

export const scrapeWandConfigs = async ({
  dataWakParentDirectoryApi,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}): Promise<NoitaScrapedWandConfig[]> => {
  const luaWands = await scrapeWandConfigsLua({ dataWakParentDirectoryApi });
  const xmlWands = await scrapeWandConfigsXml({ dataWakParentDirectoryApi });

  const allWands = [...luaWands, ...xmlWands];
  return arrayHelpers.uniqueBy(allWands, (wand) => wand.spriteId);
};

const scrapeWandConfigsXml = async ({
  dataWakParentDirectoryApi,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}) => {
  const itemsEntityDirPath = await dataWakParentDirectoryApi.path.join(
    noitaPaths.noitaDataWak.xmlData.itemEntities,
  );
  const itemsEntityDir =
    await dataWakParentDirectoryApi.getDirectory(itemsEntityDirPath);

  const fileEnumerator = fileSystemAccessHelpers.enumerateFolder(
    itemsEntityDir,
    { recursive: true },
  );

  const wands: NoitaScrapedWandConfig[] = [];

  for await (const file of fileEnumerator) {
    // basic checks to see whether the file is a wand fiel
    {
      const isXmlFile = file.getName().endsWith('.xml');
      if (!isXmlFile) continue;

      const xmlText = await file.read.asText();
      const parsedXml = await parseXml(xmlText);
      const xmlObj = XmlWrapper(parsedXml);

      // check if an entity tag exists
      const entity = xmlObj.findNthTag('Entity');
      if (!entity) continue;

      // check whether the entity has a "wand" tag
      const entityTagsString = entity.getAttribute('tags')?.asText();
      const entityTags = splitNoitaEntityTags(entityTagsString ?? '');
      if (!entityTags.includes('wand')) continue;
    }

    // extract wand info
    const mergeResult = await mergeXmlBaseFiles({
      dataWakParentDirectoryApi,
      file: file,
    });

    const xml = mergeResult.xml;

    const abilityComponent = xml.findNthTag('AbilityComponent');
    if (!abilityComponent) continue;

    const spriteFilePath = abilityComponent
      .getRequiredAttribute('sprite_file')
      .asText();
    const spriteFile = await dataWakParentDirectoryApi.getFile(spriteFilePath);

    const wand: NoitaScrapedWandConfig = {
      name: abilityComponent.getRequiredAttribute('ui_name').asText(),
      spriteId: spriteFile.getNameWithoutExtension(),
      imageBase64: '',
      gripX: undefined,
      gripY: undefined,
      tipX: undefined,
      tipY: undefined,
    };

    if (spriteFilePath.endsWith('.png')) {
      wand.imageBase64 = await spriteFile.read.asImageBase64();
    }

    // TODO: if sprite file ends with xml

    wands.push(wand);
  }

  return wands;
};

const scrapeWandConfigsLua = async ({
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
  const wandConfigs: NoitaScrapedWandConfig[] = [];

  for (const luaWandConfig of luaWandsArray) {
    const name = luaWandConfig.getRequiredField('name').required.asString();

    const sprite = luaWandConfig.getRequiredField('file').required.asString();

    const spriteSplit = sprite.split('/');
    const imagePath = await dataWakParentDirectoryApi.path.join(spriteSplit);
    const imageFile = await dataWakParentDirectoryApi.getFile(imagePath);
    const imageBase64 = await imageFile.read.asImageBase64();

    const spriteFileName = spriteSplit[spriteSplit.length - 1];
    const spriteId = spriteFileName.split('.')[0];

    const wandConfig: NoitaScrapedWandConfig = {
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
