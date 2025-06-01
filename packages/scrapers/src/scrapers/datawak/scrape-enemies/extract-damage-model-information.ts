import { XmlWrapperType } from '@noita-explorer/tools/xml';
import { arrayHelpers, mathHelpers } from '@noita-explorer/tools';
import {
  NoitaConstants,
  NoitaEnemyMaterialDamage,
} from '@noita-explorer/model-noita';

export const extractDamageModelInformation = (
  damageModelComponent: XmlWrapperType,
) => {
  let hp = damageModelComponent.getAttribute('hp')?.asFloat();
  if (hp !== undefined) {
    hp = mathHelpers.round(hp * NoitaConstants.hpMultiplier, 2);
  }

  let maxHp = damageModelComponent.getAttribute('max_hp')?.asFloat();
  if (maxHp !== undefined) {
    maxHp = mathHelpers.round(maxHp * NoitaConstants.hpMultiplier, 2);
  }

  const bloodMaterial = damageModelComponent
    .getAttribute('blood_material')
    ?.asText();

  const ragdollMaterial = damageModelComponent
    .getAttribute('ragdoll_material')
    ?.asText();

  const fireProbabilityOfIgnition = damageModelComponent
    .getAttribute('fire_probability_of_ignition')
    ?.asFloat();

  const materialsThatDamage = damageModelComponent
    .getAttribute('materials_that_damage')
    ?.asText()
    ?.split(',');
  const materialsHowMuchDamage = damageModelComponent
    .getAttribute('materials_how_much_damage')
    ?.asText()
    ?.split(',');

  const hasDamageMaterialsAttributes =
    materialsThatDamage !== undefined &&
    materialsHowMuchDamage !== undefined &&
    materialsThatDamage.length === materialsHowMuchDamage.length;

  const damages = hasDamageMaterialsAttributes
    ? arrayHelpers
        .zip(materialsThatDamage, materialsHowMuchDamage)
        .map((materialDamage) => {
          const [materialName, damageMultiplier] = materialDamage;
          return {
            name: materialName,
            multiplier: parseFloat(damageMultiplier),
          } as NoitaEnemyMaterialDamage;
        })
    : undefined;

  const knockBackResistance = damageModelComponent
    .getAttribute('minimum_knockback_force')
    ?.asInt();

  const airNeeded = damageModelComponent
    .getAttribute('air_needed')
    ?.asBoolean();

  const physicsObjectsDamage = damageModelComponent
    .getAttribute('physics_objects_damage')
    ?.asBoolean();

  return {
    hp,
    maxHp,
    bloodMaterial,
    damages,
    knockBackResistance,
    airNeeded,
    ragdollMaterial,
    fireProbabilityOfIgnition,
    physicsObjectsDamage,
  };
};
