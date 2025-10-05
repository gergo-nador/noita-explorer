import { NoitaInventoryWand } from '../wand/noita-inventory-wand.ts';
import { NoitaInventoryItem } from '../items/noita-inventory-item.ts';

export interface NoitaPlayerInventory {
  wands: NoitaInventoryWand[];
  items: NoitaInventoryItem[];
}
