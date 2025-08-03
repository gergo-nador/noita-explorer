import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaProtection } from '@noita-explorer/model-noita';

const basePath = '/images/data-wak/protections/';
const getImagePath = (file: string) => basePath + file;

export const NoitaProtections: StringKeyDictionary<NoitaProtection> = {
  PROTECTION_ALL: {
    id: 'PROTECTION_ALL',
    name: 'Immune to EVERYTHING',
    image: getImagePath('protection_all.png'),
  },
  PROTECTION_ELECTRICITY: {
    id: 'PROTECTION_ELECTRICITY',
    name: 'Electricity Immunity',
    image: getImagePath('protection_electricity.png'),
  },
  STUN_PROTECTION_ELECTRICITY: {
    id: 'STUN_PROTECTION_ELECTRICITY',
    name: 'Stun Electricity Immunity',
    image: getImagePath('protection_electricity_stun.png'),
  },
  PROTECTION_EXPLOSION: {
    id: 'PROTECTION_EXPLOSION',
    name: 'Explosion Immunity',
    image: getImagePath('protection_explosion.png'),
  },
  PROTECTION_FIRE: {
    id: 'PROTECTION_FIRE',
    name: 'Fire Immunity',
    image: getImagePath('protection_fire.png'),
  },
  PROTECTION_FREEZE: {
    id: 'PROTECTION_FREEZE',
    name: 'Freeze Immunity',
    image: getImagePath('protection_freeze.png'),
  },
  STUN_PROTECTION_FREEZE: {
    id: 'STUN_PROTECTION_FREEZE',
    name: 'Stun Freeze Immunity',
    image: getImagePath('protection_freeze_stun.png'),
  },
  PROTECTION_GLUE: {
    id: 'PROTECTION_GLUE',
    name: 'Glue Immunity',
    image: getImagePath('protection_glue.png'),
  },
  PROTECTION_MELEE: {
    id: 'PROTECTION_MELEE',
    name: 'Melee Immunity',
    image: getImagePath('protection_melee.png'),
  },
  PROTECTION_PHYSICS_IMPACT: {
    id: 'PROTECTION_PHYSICS_IMPACT',
    name: 'Physics Impact Immunity',
    image: getImagePath('protection_physics_impact.png'),
  },
  PROTECTION_POLYMORPH: {
    id: 'PROTECTION_POLYMORPH',
    name: 'Polymorph Immunity',
    image: getImagePath('protection_polymorph.png'),
  },
  PROTECTION_PROJECTILE: {
    id: 'PROTECTION_PROJECTILE',
    name: 'Projectile Immunity',
    image: getImagePath('protection_projectile.png'),
  },
  PROTECTION_RADIOACTIVITY: {
    id: 'PROTECTION_RADIOACTIVITY',
    name: 'Toxic Immunity',
    image: getImagePath('protection_radioactivity.png'),
  },
  PROTECTION_RESURRECTION: {
    id: 'PROTECTION_RESURRECTION',
    name: 'Resurrection Immunity',
    image: getImagePath('protection_resurrection.png'),
  },
  PROTECTION_SUFFOCATE: {
    id: 'PROTECTION_SUFFOCATE',
    name: 'Suffocation Immunity',
    image: getImagePath('protection_suffocate.png'),
  },
  PROTECTION_TOUCH_MAGIC: {
    id: 'PROTECTION_TOUCH_MAGIC',
    name: 'Touch Magic Immunity',
    image: getImagePath('protection_touch_of.png'),
  },
} as const;
