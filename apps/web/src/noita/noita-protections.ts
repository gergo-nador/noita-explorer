import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaProtection } from '@noita-explorer/model-noita';
import { publicPaths } from '../utils/public-paths.ts';

export const NoitaProtections: StringKeyDictionary<NoitaProtection> = {
  PROTECTION_ALL: {
    id: 'PROTECTION_ALL',
    name: 'Immune to EVERYTHING',
    image: publicPaths.static.dataWak.protections('protection_all'),
  },
  PROTECTION_ELECTRICITY: {
    id: 'PROTECTION_ELECTRICITY',
    name: 'Electricity Immunity',
    image: publicPaths.static.dataWak.protections('protection_electricity'),
  },
  STUN_PROTECTION_ELECTRICITY: {
    id: 'STUN_PROTECTION_ELECTRICITY',
    name: 'Stun Electricity Immunity',
    image: publicPaths.static.dataWak.protections(
      'protection_electricity_stun',
    ),
  },
  PROTECTION_EXPLOSION: {
    id: 'PROTECTION_EXPLOSION',
    name: 'Explosion Immunity',
    image: publicPaths.static.dataWak.protections('protection_explosion'),
  },
  PROTECTION_FIRE: {
    id: 'PROTECTION_FIRE',
    name: 'Fire Immunity',
    image: publicPaths.static.dataWak.protections('protection_fire'),
  },
  PROTECTION_FREEZE: {
    id: 'PROTECTION_FREEZE',
    name: 'Freeze Immunity',
    image: publicPaths.static.dataWak.protections('protection_freeze'),
  },
  STUN_PROTECTION_FREEZE: {
    id: 'STUN_PROTECTION_FREEZE',
    name: 'Stun Freeze Immunity',
    image: publicPaths.static.dataWak.protections('protection_freeze_stun'),
  },
  PROTECTION_GLUE: {
    id: 'PROTECTION_GLUE',
    name: 'Glue Immunity',
    image: publicPaths.static.dataWak.protections('protection_glue'),
  },
  PROTECTION_MELEE: {
    id: 'PROTECTION_MELEE',
    name: 'Melee Immunity',
    image: publicPaths.static.dataWak.protections('protection_melee'),
  },
  PROTECTION_PHYSICS_IMPACT: {
    id: 'PROTECTION_PHYSICS_IMPACT',
    name: 'Physics Impact Immunity',
    image: publicPaths.static.dataWak.protections('protection_physics_impact'),
  },
  PROTECTION_POLYMORPH: {
    id: 'PROTECTION_POLYMORPH',
    name: 'Polymorph Immunity',
    image: publicPaths.static.dataWak.protections('protection_polymorph'),
  },
  PROTECTION_PROJECTILE: {
    id: 'PROTECTION_PROJECTILE',
    name: 'Projectile Immunity',
    image: publicPaths.static.dataWak.protections('protection_projectile'),
  },
  PROTECTION_RADIOACTIVITY: {
    id: 'PROTECTION_RADIOACTIVITY',
    name: 'Toxic Immunity',
    image: publicPaths.static.dataWak.protections('protection_radioactivity'),
  },
  PROTECTION_RESURRECTION: {
    id: 'PROTECTION_RESURRECTION',
    name: 'Resurrection Immunity',
    image: publicPaths.static.dataWak.protections('protection_resurrection'),
  },
  PROTECTION_SUFFOCATE: {
    id: 'PROTECTION_SUFFOCATE',
    name: 'Suffocation Immunity',
    image: publicPaths.static.dataWak.protections('protection_suffocate'),
  },
  PROTECTION_TOUCH_MAGIC: {
    id: 'PROTECTION_TOUCH_MAGIC',
    name: 'Touch Magic Immunity',
    image: publicPaths.static.dataWak.protections('protection_touch_of'),
  },
} as const;
