import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaSpellType } from '@noita-explorer/model-noita';
import { publicPaths } from '../utils/public-paths.ts';

export const NoitaSpellTypesDictionary: StringKeyDictionary<NoitaSpellType> = {
  ACTION_TYPE_DRAW_MANY: {
    id: 'ACTION_TYPE_DRAW_MANY',
    name: 'Multicast',
    image: publicPaths.static.dataWak.spellBackgrounds('item_bg_draw_many'),
  },
  ACTION_TYPE_MATERIAL: {
    id: 'ACTION_TYPE_MATERIAL',
    name: 'Material',
    image: publicPaths.static.dataWak.spellBackgrounds('item_bg_material'),
  },
  ACTION_TYPE_MODIFIER: {
    id: 'ACTION_TYPE_MODIFIER',
    name: 'Projectile Modifier',
    image: publicPaths.static.dataWak.spellBackgrounds('item_bg_modifier'),
  },
  ACTION_TYPE_OTHER: {
    id: 'ACTION_TYPE_OTHER',
    name: 'Other',
    image: publicPaths.static.dataWak.spellBackgrounds('item_bg_other'),
  },
  ACTION_TYPE_PASSIVE: {
    id: 'ACTION_TYPE_PASSIVE',
    name: 'Passive',
    image: publicPaths.static.dataWak.spellBackgrounds('item_bg_passive'),
  },
  ACTION_TYPE_PROJECTILE: {
    id: 'ACTION_TYPE_PROJECTILE',
    name: 'Projectile',
    image: publicPaths.static.dataWak.spellBackgrounds('item_bg_projectile'),
  },
  ACTION_TYPE_STATIC_PROJECTILE: {
    id: 'ACTION_TYPE_STATIC_PROJECTILE',
    name: 'Static Projectile',
    image: publicPaths.static.dataWak.spellBackgrounds(
      'item_bg_static_projectile',
    ),
  },
  ACTION_TYPE_UTILITY: {
    id: 'ACTION_TYPE_UTILITY',
    name: 'Utility',
    image: publicPaths.static.dataWak.spellBackgrounds('item_bg_utility'),
  },
} as const;
