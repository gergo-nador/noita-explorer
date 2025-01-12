import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaProtection } from '@noita-explorer/model-noita';

import iconProtectionAll from '../assets/icons/protection/protection_all.png';
import iconProtectionElectricity from '../assets/icons/protection/protection_electricity.png';
import iconProtectionElectricityStun from '../assets/icons/protection/protection_electricity_stun.png';
import iconProtectionExplosion from '../assets/icons/protection/protection_explosion.png';
import iconProtectionFire from '../assets/icons/protection/protection_fire.png';
import iconProtectionFreeze from '../assets/icons/protection/protection_freeze.png';
import iconProtectionFreezeStun from '../assets/icons/protection/protection_freeze_stun.png';
import iconProtectionGlue from '../assets/icons/protection/protection_glue.png';
import iconProtectionMelee from '../assets/icons/protection/protection_melee.png';
import iconProtectionPhysicsImpact from '../assets/icons/protection/protection_physics_impact.png';
import iconProtectionPolymorph from '../assets/icons/protection/protection_polymorph.png';
import iconProtectionProjectile from '../assets/icons/protection/protection_projectile.png';
import iconProtectionRadioActivity from '../assets/icons/protection/protection_radioactivity.png';
import iconProtectionResurrection from '../assets/icons/protection/protection_resurrection.png';
import iconProtectionSuffocate from '../assets/icons/protection/protection_suffocate.png';
import iconProtectionTouchMagic from '../assets/icons/protection/protection_touch_of.png';

export const NoitaProtections: StringKeyDictionary<NoitaProtection> = {
  PROTECTION_ALL: {
    id: 'PROTECTION_ALL',
    name: 'Immune to EVERYTHING',
    image: iconProtectionAll,
  },
  PROTECTION_ELECTRICITY: {
    id: 'PROTECTION_ELECTRICITY',
    name: 'Electricity Immunity',
    image: iconProtectionElectricity,
  },
  STUN_PROTECTION_ELECTRICITY: {
    id: 'STUN_PROTECTION_ELECTRICITY',
    name: 'Stun Electricity Immunity',
    image: iconProtectionElectricityStun,
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
  STUN_PROTECTION_FREEZE: {
    id: 'STUN_PROTECTION_FREEZE',
    name: 'Stun Freeze Immunity',
    image: iconProtectionFreezeStun,
  },
  PROTECTION_GLUE: {
    id: 'PROTECTION_GLUE',
    name: 'Glue Immunity',
    image: iconProtectionGlue,
  },
  PROTECTION_MELEE: {
    id: 'PROTECTION_MELEE',
    name: 'Melee Immunity',
    image: iconProtectionMelee,
  },
  PROTECTION_PHYSICS_IMPACT: {
    id: 'PROTECTION_PHYSICS_IMPACT',
    name: 'Physics Impact Immunity',
    image: iconProtectionPhysicsImpact,
  },
  PROTECTION_POLYMORPH: {
    id: 'PROTECTION_POLYMORPH',
    name: 'Polymorph Immunity',
    image: iconProtectionPolymorph,
  },
  PROTECTION_PROJECTILE: {
    id: 'PROTECTION_PROJECTILE',
    name: 'Projectile Immunity',
    image: iconProtectionProjectile,
  },
  PROTECTION_RADIOACTIVITY: {
    id: 'PROTECTION_RADIOACTIVITY',
    name: 'Toxic Immunity',
    image: iconProtectionRadioActivity,
  },
  PROTECTION_RESURRECTION: {
    id: 'PROTECTION_RESURRECTION',
    name: 'Resurrection Immunity',
    image: iconProtectionResurrection,
  },
  PROTECTION_SUFFOCATE: {
    id: 'PROTECTION_SUFFOCATE',
    name: 'Suffocation Immunity',
    image: iconProtectionSuffocate,
  },
  PROTECTION_TOUCH_MAGIC: {
    id: 'PROTECTION_TOUCH_MAGIC',
    name: 'Touch Magic Immunity',
    image: iconProtectionTouchMagic,
  },
};
