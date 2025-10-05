import { NoitaInventoryWand } from '@noita-explorer/model-noita';
import { publicPaths } from '../../../utils/public-paths.ts';
import {
  InventoryIcon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { NoitaWandCard } from '../../../components/noita-wand-card.tsx';

interface Props {
  inventoryWand: NoitaInventoryWand;
}

export const InventoryWand = ({ inventoryWand }: Props) => {
  const usesRemaining: number | undefined = inventoryWand.wand.spells.reduce(
    (minUses: number | undefined, spell) => {
      const usesRemaining = spell.usesRemaining;
      if (usesRemaining === undefined || usesRemaining < 0) return minUses;
      if (minUses === undefined) return usesRemaining;

      if (minUses === 0 && usesRemaining !== 0) return usesRemaining;
      if (usesRemaining < minUses && usesRemaining !== 0) return usesRemaining;

      return minUses;
    },
    undefined,
  );

  const wandImage = publicPaths.generated.wand.image({
    wandId: inventoryWand.wand.spriteId,
  });

  return (
    <NoitaTooltipWrapper
      content={<NoitaWandCard wand={inventoryWand.wand} withoutCardBorder />}
    >
      <InventoryIcon
        icon={wandImage}
        size={50}
        useOriginalIconSize
        usesRemaining={usesRemaining}
      />
    </NoitaTooltipWrapper>
  );
};
