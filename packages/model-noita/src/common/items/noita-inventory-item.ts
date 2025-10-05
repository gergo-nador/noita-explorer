import { NoitaPotion } from './noita-potion.ts';

interface NoitaInventoryItemBase {
  position: number;
}

export interface NoitaInventoryPotionItem extends NoitaInventoryItemBase {
  type: 'potion';
  item: NoitaPotion;
}

export type NoitaInventoryItem = NoitaInventoryPotionItem;
