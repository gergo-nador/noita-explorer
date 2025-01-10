import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaProtection } from '@noita-explorer/model-noita';

import iconProtectionElectricity from '../assets/icons/protection/protection_electricity.png';
import iconProtectionExplosion from '../assets/icons/protection/protection_explosion.png';
import iconProtectionFire from '../assets/icons/protection/protection_fire.png';
import iconProtectionFreeze from '../assets/icons/protection/protection_freeze.png';
import iconProtectionMelee from '../assets/icons/protection/protection_melee.png';
import iconProtectionRadioActivity from '../assets/icons/protection/protection_radioactivity.png';

export const NoitaProtections: StringKeyDictionary<NoitaProtection> = {
  PROTECTION_ELECTRICITY: {
    id: 'PROTECTION_ELECTRICITY',
    name: 'Electricity Immunity',
    image: iconProtectionElectricity,
  },
  PROTECTION_EXPLOSION: {
    id: 'PROTECTION_EXPLOSION',
    name: 'Explosion Immunity',
    image: iconProtectionExplosion,
  },
  PROTECTION_FIRE: {
    id: 'PROTECTION_FIRE',
    name: 'Fire Immunity',
    image: iconProtectionFire,
  },
  PROTECTION_FREEZE: {
    id: 'PROTECTION_FREEZE',
    name: 'Freeze Immunity',
    image: iconProtectionFreeze,
  },
  PROTECTION_MELEE: {
    id: 'PROTECTION_MELEE',
    name: 'Melee Immunity',
    image: iconProtectionMelee,
  },
  PROTECTION_RADIOACTIVITY: {
    id: 'PROTECTION_RADIOACTIVITY',
    name: 'Toxic Immunity',
    image: iconProtectionRadioActivity,
  },
};
