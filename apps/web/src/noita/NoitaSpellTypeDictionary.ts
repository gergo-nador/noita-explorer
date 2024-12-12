import { StringKeyDictionary, NoitaSpellType } from '@noita-explorer/model';

import bg_draw_many from '../assets/spell_backgrounds/item_bg_draw_many.png';
import bg_material from '../assets/spell_backgrounds/item_bg_material.png';
import bg_modifier from '../assets/spell_backgrounds/item_bg_modifier.png';
import bg_other from '../assets/spell_backgrounds/item_bg_other.png';
import bg_passive from '../assets/spell_backgrounds/item_bg_passive.png';
import bg_projectile from '../assets/spell_backgrounds/item_bg_projectile.png';
import bg_static_projectile from '../assets/spell_backgrounds/item_bg_static_projectile.png';
import bg_utility from '../assets/spell_backgrounds/item_bg_utility.png';

export const NoitaSpellTypesDictionary: StringKeyDictionary<NoitaSpellType> = {
  ACTION_TYPE_DRAW_MANY: {
    id: 'ACTION_TYPE_DRAW_MANY',
    name: 'Multicast',
    image: bg_draw_many,
  },
  ACTION_TYPE_MATERIAL: {
    id: 'ACTION_TYPE_MATERIAL',
    name: 'Material',
    image: bg_material,
  },
  ACTION_TYPE_MODIFIER: {
    id: 'ACTION_TYPE_MODIFIER',
    name: 'Projectile Modifier',
    image: bg_modifier,
  },
  ACTION_TYPE_OTHER: {
    id: 'ACTION_TYPE_OTHER',
    name: 'Other',
    image: bg_other,
  },
  ACTION_TYPE_PASSIVE: {
    id: 'ACTION_TYPE_PASSIVE',
    name: 'Passive',
    image: bg_passive,
  },
  ACTION_TYPE_PROJECTILE: {
    id: 'ACTION_TYPE_PROJECTILE',
    name: 'Projectile',
    image: bg_projectile,
  },
  ACTION_TYPE_STATIC_PROJECTILE: {
    id: 'ACTION_TYPE_STATIC_PROJECTILE',
    name: 'Static Projectile',
    image: bg_static_projectile,
  },
  ACTION_TYPE_UTILITY: {
    id: 'ACTION_TYPE_UTILITY',
    name: 'Utility',
    image: bg_utility,
  },
};
