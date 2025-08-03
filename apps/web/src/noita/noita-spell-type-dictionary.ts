import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaSpellType } from '@noita-explorer/model-noita';

const basePath = '/images/data-wak/spell-backgrounds/';
const getImagePath = (file: string) => basePath + file;

export const NoitaSpellTypesDictionary: StringKeyDictionary<NoitaSpellType> = {
  ACTION_TYPE_DRAW_MANY: {
    id: 'ACTION_TYPE_DRAW_MANY',
    name: 'Multicast',
    image: getImagePath('item_bg_draw_many.png'),
  },
  ACTION_TYPE_MATERIAL: {
    id: 'ACTION_TYPE_MATERIAL',
    name: 'Material',
    image: getImagePath('item_bg_material.png'),
  },
  ACTION_TYPE_MODIFIER: {
    id: 'ACTION_TYPE_MODIFIER',
    name: 'Projectile Modifier',
    image: getImagePath('item_bg_modifier.png'),
  },
  ACTION_TYPE_OTHER: {
    id: 'ACTION_TYPE_OTHER',
    name: 'Other',
    image: getImagePath('item_bg_other.png'),
  },
  ACTION_TYPE_PASSIVE: {
    id: 'ACTION_TYPE_PASSIVE',
    name: 'Passive',
    image: getImagePath('item_bg_passive.png'),
  },
  ACTION_TYPE_PROJECTILE: {
    id: 'ACTION_TYPE_PROJECTILE',
    name: 'Projectile',
    image: getImagePath('item_bg_projectile.png'),
  },
  ACTION_TYPE_STATIC_PROJECTILE: {
    id: 'ACTION_TYPE_STATIC_PROJECTILE',
    name: 'Static Projectile',
    image: getImagePath('item_bg_static_projectile.png'),
  },
  ACTION_TYPE_UTILITY: {
    id: 'ACTION_TYPE_UTILITY',
    name: 'Utility',
    image: getImagePath('item_bg_utility.png'),
  },
} as const;
