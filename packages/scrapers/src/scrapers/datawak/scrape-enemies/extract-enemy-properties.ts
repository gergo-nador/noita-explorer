import { NoitaEnemy, NoitaEnemyGameEffect } from '@noita-explorer/model-noita';
import { XmlWrapperType } from '@noita-explorer/tools/xml';
import { splitNoitaEntityTags } from '../../common/tags.ts';
import { arrayHelpers } from '@noita-explorer/tools';
import { extractDamageModelInformation } from './extract-damage-model-information.ts';
import { extractDamageMultipliers } from './extract-damage-multipliers.ts';
import { extractGenomeData } from './extract-genome-data.ts';

/**
 * Extracts XML information of enemies/animals, overwriting the properties
 * in case if the data is present in the XML data
 * @param enemy
 * @param entityTag
 */
export const extractEnemyProperties = ({
  enemy,
  entityTag,
}: {
  enemy: NoitaEnemy;
  entityTag: XmlWrapperType;
}) => {
  const tags = entityTag.getAttribute('tags')?.asText();
  if (tags !== undefined) {
    const splitted = splitNoitaEntityTags(tags);
    enemy.debug.entityTags = arrayHelpers.unique([
      ...enemy.debug.entityTags,
      ...splitted,
    ]);
  }

  const damageModelComponent = entityTag.findNthTag('DamageModelComponent');
  if (damageModelComponent !== undefined) {
    const extracted = extractDamageModelInformation(damageModelComponent);
    enemy.hp = extracted.hp ?? enemy.hp;
    enemy.maxHp = extracted.maxHp ?? enemy.maxHp;
    enemy.bloodMaterial = extracted.bloodMaterial ?? enemy.bloodMaterial;
    enemy.materialsThatDamage = extracted.damages ?? enemy.materialsThatDamage;
    enemy.knockBackResistance =
      extracted.knockBackResistance ?? enemy.knockBackResistance;
    enemy.airNeeded = extracted.airNeeded ?? enemy.airNeeded;
    enemy.ragdollMaterial = extracted.ragdollMaterial ?? enemy.ragdollMaterial;
    enemy.fireProbabilityOfIgnition =
      extracted.fireProbabilityOfIgnition ?? enemy.fireProbabilityOfIgnition;
    enemy.physicsObjectsDamage =
      extracted.physicsObjectsDamage ?? enemy.physicsObjectsDamage;
  }

  const genomeDataComponent = entityTag.findNthTag('GenomeDataComponent');
  if (genomeDataComponent !== undefined) {
    enemy.genomeData = extractGenomeData({
      genomeData: enemy.genomeData,
      genomeDataComponent: genomeDataComponent,
    });
  }

  const luaComponents = entityTag.findAllTags('LuaComponent');
  for (const luaComponent of luaComponents) {
    const goldDropScript = 'data/scripts/items/drop_money.lua';
    const scriptDeath = luaComponent.getAttribute('script_death')?.asText();

    if (scriptDeath !== undefined && scriptDeath === goldDropScript) {
      enemy.hasGoldDrop = true;
    }
  }

  const variableStorageComponent = entityTag.findNthTag(
    'VariableStorageComponent',
  );
  if (variableStorageComponent !== undefined) {
    const tags = variableStorageComponent
      .getAttribute('_tags')
      ?.asText()
      ?.split(',');

    if (tags !== undefined && tags.includes('no_gold_drop')) {
      enemy.hasGoldDrop = false;
    }
  }

  const gameEffectComponents = entityTag.findAllTags('GameEffectComponent');
  for (const gameEffectComponent of gameEffectComponents) {
    const effectId = gameEffectComponent
      .getRequiredAttribute('effect')
      .asText()!;
    const frames = gameEffectComponent.getAttribute('frames')?.asInt() ?? 0;

    const gameEffect: NoitaEnemyGameEffect = {
      id: effectId,
      frames: frames,
    };

    if (enemy.gameEffects.some((effect) => effect.id === effectId)) {
      continue;
    }
    enemy.gameEffects.push(gameEffect);
  }

  const damageMultipliersTag =
    damageModelComponent?.findNthTag('damage_multipliers');

  if (damageMultipliersTag !== undefined) {
    extractDamageMultipliers({
      damageMultipliers: enemy.damageMultipliers,
      damageMultipliersTag: damageMultipliersTag,
    });
  }
};
