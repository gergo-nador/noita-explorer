import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { UnlockDecorationAction } from '@noita-explorer/model-noita';
import { noitaPaths } from '../../../noita-paths.ts';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { splitNoitaEntityTags } from '../../../scrapers/common/tags.ts';
import { createFlagUtil } from './utils.ts';

export const unlockDecoration = async ({
  save00DirectoryApi,
  action,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
  action: UnlockDecorationAction;
}) => {
  if (action.payload.permanent) {
    await createFlagUtil({
      save00DirectoryApi,
      flag: action.payload.decoration,
    });
  }

  const playerStateFilePath = await save00DirectoryApi.path.join(
    noitaPaths.save00.player,
  );

  let playerStateFile: FileSystemFileAccess;
  try {
    playerStateFile = await save00DirectoryApi.getFile(playerStateFilePath);
  } catch {
    // if it was requested to unlock permanently, then it's okay if there is no ongoing run
    if (action.payload.permanent) {
      return;
    }
    // if it was requested to unlock it only for this run, we want to fail this action
    throw new Error('player.xml file could not be found');
  }

  const playerFileText = await playerStateFile.read.asText();
  const xml = await parseXml(playerFileText);
  const xmlWrapper = XmlWrapper(xml);

  const entity = xmlWrapper.findNthTag('Entity');
  if (!entity) {
    throw new Error('No root Entity tag exists in player.xml');
  }

  let spriteTagToLookFor: string;
  if (action.payload.decoration === 'secret_amulet')
    spriteTagToLookFor = 'player_amulet';
  else if (action.payload.decoration === 'secret_amulet_gem')
    spriteTagToLookFor = 'player_amulet_gem';
  else if (action.payload.decoration === 'secret_hat')
    spriteTagToLookFor = 'player_hat2';
  else {
    throw new Error(
      `Decoration ${action.payload.decoration} is not implemented to unlock sprite for current run`,
    );
  }

  const spriteComponents = entity.findTagArray('SpriteComponent');
  const spriteComponent = spriteComponents.find((sprite) => {
    const tagList = sprite.getAttribute('_tags')?.asText();
    if (!tagList) return false;
    const tags = splitNoitaEntityTags(tagList);

    return tags.includes(spriteTagToLookFor);
  });

  if (!spriteComponent) {
    throw new Error(
      'Could not find SpriteComponent with tag ' + spriteTagToLookFor,
    );
  }

  spriteComponent.setAttribute('_enabled', '1');

  const xmlText = xmlWrapper.toXmlString();
  await playerStateFile.modify.fromText(xmlText);
};
