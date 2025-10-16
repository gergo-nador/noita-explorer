import { Flex } from '@noita-explorer/react-utils';
import { useSave00Store } from '../../stores/save00.ts';
import { InventoryWand } from './inventory-items/inventory-wand.tsx';
import { enumerateHelpers } from '@noita-explorer/tools';
import { InventoryPotion } from './inventory-items/inventory-potion.tsx';
import { InventoryIcon } from '@noita-explorer/noita-component-library';

export const CurrentRunQuickInventory = () => {
  const { currentRun } = useSave00Store();

  if (!currentRun) return;

  return (
    <Flex gap={5}>
      {enumerateHelpers.range(0, 4).map((i) => {
        const wand = currentRun.playerState.inventory.wands.find(
          (wand) => wand.position === i,
        );

        if (wand) {
          return <InventoryWand key={wand.position} inventoryWand={wand} />;
        }

        return <InventoryIcon size={50} key={i} />;
      })}
      {enumerateHelpers.range(0, 4).map((i) => {
        const item = currentRun.playerState.inventory.items.find(
          (item) => item.position === i,
        );
        if (item?.type === 'potion') {
          return <InventoryPotion item={item} key={item.position} />;
        }

        return <InventoryIcon size={50} key={i} />;
      })}
    </Flex>
  );
};
