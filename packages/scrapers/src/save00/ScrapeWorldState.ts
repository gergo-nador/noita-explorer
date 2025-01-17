import { NoitaWorldState } from '@noita-explorer/model-noita';
import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { noitaPaths } from '../NoitaPaths.ts';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { stringHelpers } from '@noita-explorer/tools';

export const scrapeWorldState = async ({
  save00DirectoryApi,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
}): Promise<NoitaWorldState | undefined> => {
  const worldStateFilePath = await save00DirectoryApi.path.join(
    noitaPaths.save00.worldState,
  );

  let worldStateFile: FileSystemFileAccess;
  try {
    worldStateFile = await save00DirectoryApi.getFile(worldStateFilePath);
  } catch {
    return undefined;
  }

  const worldStateText = await worldStateFile.read.asText();
  const worldStateXml = await parseXml(worldStateText);
  const xmlWrapper = XmlWrapper(worldStateXml);

  const worldStateEntity = xmlWrapper.findNthTag('Entity');
  if (worldStateEntity === undefined) {
    return undefined;
  }

  const worldStateComponent = worldStateEntity.findNthTag(
    'WorldStateComponent',
  );
  if (worldStateComponent === undefined) {
    return undefined;
  }

  const worldState: NoitaWorldState = {
    dayCount: worldStateComponent.getAttribute('day_count')?.asInt() ?? -1,
    modsActiveDuringThisRun:
      worldStateComponent
        .getAttribute('mods_have_been_active_during_this_run')
        ?.asBoolean() ?? false,
    perks: {
      goldIsForever:
        worldStateComponent.getAttribute('perk_gold_is_forever')?.asBoolean() ??
        false,
      infiniteSpells:
        worldStateComponent.getAttribute('perk_infinite_spells')?.asBoolean() ??
        false,
      ratsPlayerFriendly:
        worldStateComponent
          .getAttribute('perk_rats_player_friendly')
          ?.asBoolean() ?? false,
      pickedPerks: [],
    },
    flags: {
      newActionIds: [],
      newPerkIds: [],
      newEnemyIds: [],
    },
    runType: 'normal',
    fungalShifts: [],
  };

  const luaGlobals = worldStateComponent.findNthTag('lua_globals');
  if (luaGlobals !== undefined) {
    const globals = luaGlobals.findTagArray('E');

    for (const global of globals) {
      const key = global.getRequiredAttribute('key').asText()!;
      const valueAttr = global.getAttribute('value');

      if (key.startsWith('PERK_PICKED')) {
        const perkId = stringHelpers.trim({
          text: key,
          fromStart: 'PERK_PICKED_',
          fromEnd: '_PICKUP_COUNT',
        });
        const pickupCount = valueAttr?.asInt();

        worldState.perks.pickedPerks.push({
          perkId: perkId,
          count: pickupCount,
        });
      }
    }
  }

  const flags = worldStateComponent.findNthTag('flags');
  if (flags !== undefined) {
    const strings = flags.findTagArray('string');
    for (const flag of strings) {
      const text = flag.getTextContent();
      if (text === undefined) {
        continue;
      }

      // runs
      if (text === 'run_nightmare') {
        worldState.runType = 'nightmare';
      }
      // new actions
      else if (text.startsWith('new_action_')) {
        const newActionId = stringHelpers
          .trim({
            text: text,
            fromStart: 'new_action_',
          })
          .toUpperCase();

        worldState.flags.newActionIds.push(newActionId);
      }
      // new perk
      else if (text.startsWith('new_perk_picked_')) {
        const newPerkId = stringHelpers
          .trim({
            text: text,
            fromStart: 'new_perk_picked_',
          })
          .toUpperCase();

        worldState.flags.newPerkIds.push(newPerkId);
      } else if (text.startsWith('new_kill_')) {
        const newEnemyId = stringHelpers.trim({
          text: text,
          fromStart: 'new_kill_',
        });

        worldState.flags.newEnemyIds.push(newEnemyId);
      }
    }
  }

  const fungalShifts = worldStateComponent.findNthTag('changed_materials');
  if (fungalShifts !== undefined) {
    let shiftFrom: string | undefined = undefined;

    const strings = fungalShifts.findTagArray('string');
    for (const flag of strings) {
      const text = flag.getTextContent();
      if (text === undefined) {
        continue;
      }

      if (shiftFrom === undefined) {
        shiftFrom = text;
        continue;
      }

      worldState.fungalShifts.push({
        fromMaterials: [shiftFrom],
        toMaterials: [text],
      });
      shiftFrom = undefined;
    }
  }

  return worldState;
};
