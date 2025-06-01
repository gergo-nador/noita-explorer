import { objectHelpers } from '@noita-explorer/tools';
import { NoitaDamageMultipliers } from '@noita-explorer/model-noita';
import { XmlWrapperType } from '@noita-explorer/tools/xml';

export const extractDamageMultipliers = ({
  damageMultipliers,
  damageMultipliersTag,
}: {
  damageMultipliers: NoitaDamageMultipliers;
  damageMultipliersTag: XmlWrapperType;
}) => {
  const damageMultiplierProxy =
    objectHelpers.proxiedPropertiesOf(damageMultipliers);

  const extractDamageMultipliers = [
    damageMultiplierProxy.curse,
    damageMultiplierProxy.drill,
    damageMultiplierProxy.electricity,
    damageMultiplierProxy.explosion,
    damageMultiplierProxy.fire,
    damageMultiplierProxy.healing,
    damageMultiplierProxy.holy,
    damageMultiplierProxy.ice,
    damageMultiplierProxy.melee,
    damageMultiplierProxy.overeating,
    damageMultiplierProxy.physics_hit,
    damageMultiplierProxy.poison,
    damageMultiplierProxy.projectile,
    damageMultiplierProxy.radioactive,
    damageMultiplierProxy.slice,
  ];

  for (const multiplier of extractDamageMultipliers) {
    if (multiplier === undefined) continue;

    const multiplierValue = damageMultipliersTag
      .getAttribute(multiplier)
      ?.asFloat();

    damageMultipliers[multiplier] =
      multiplierValue ?? damageMultipliers[multiplier];
  }
};
