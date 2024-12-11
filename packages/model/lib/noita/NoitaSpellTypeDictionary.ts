import { StringKeyDictionary } from '../common/StringKeyDictionary';
import { NoitaSpellType } from './NoitaSpellType';

export const NoitaSpellTypesDictionary: StringKeyDictionary<NoitaSpellType> = {
  ACTION_TYPE_DRAW_MANY: {
    id: 'ACTION_TYPE_DRAW_MANY',
    name: 'Multicast',
  },
  ACTION_TYPE_MATERIAL: {
    id: 'ACTION_TYPE_MATERIAL',
    name: 'Material',
  },
  ACTION_TYPE_MODIFIER: {
    id: 'ACTION_TYPE_MODIFIER',
    name: 'Projectile Modifier',
  },
  ACTION_TYPE_OTHER: {
    id: 'ACTION_TYPE_OTHER',
    name: 'Other',
  },
  ACTION_TYPE_PASSIVE: {
    id: 'ACTION_TYPE_PASSIVE',
    name: 'Passive',
  },
  ACTION_TYPE_PROJECTILE: {
    id: 'ACTION_TYPE_PROJECTILE',
    name: 'Projectile',
  },
  ACTION_TYPE_STATIC_PROJECTILE: {
    id: 'ACTION_TYPE_STATIC_PROJECTILE',
    name: 'Static Projectile',
  },
  ACTION_TYPE_UTILITY: {
    id: 'ACTION_TYPE_UTILITY',
    name: 'Utility',
  },
};
