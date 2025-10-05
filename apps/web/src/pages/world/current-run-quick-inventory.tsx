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
      {currentRun.playerState.inventory.wands.map((inventoryWand, index) => (
        <InventoryWand key={index} inventoryWand={inventoryWand} />
      ))}
      {enumerateHelpers.range(0, 4).map((i) => {
        const item = currentRun.playerState.inventory.items.find(
          (item) => item.position === i,
        );
        if (item?.type === 'potion') {
          return <InventoryPotion item={item} key={item.position} />;
        }

        return <InventoryIcon size={50} />;
      })}
    </Flex>
  );
};
