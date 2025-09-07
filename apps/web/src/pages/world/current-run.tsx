import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import {
  InventoryIcon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { CurrentRunPerksView } from './current-run-perks-view.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { useSave00Store } from '../../stores/save00.ts';
import { NoitaWandCard } from '../../components/noita-wand-card.tsx';
import { CurrentRunPlayerStatus } from './current-run-player-status.tsx';
import { publicPaths } from '../../utils/public-paths.ts';

export const CurrentRun = () => {
  const { data } = useNoitaDataWakStore();
  const { currentRun } = useSave00Store();

  if (!data) {
    return <div>Data wak is still loading...</div>;
  }

  if (!currentRun) {
    return <div>No current run detected.</div>;
  }

  return (
    <>
      <Flex justify='space-between'>
        <Flex gap={5}>
          {currentRun.playerState.inventory.wands.map((inventoryWand) => {
            const usesRemaining: number | undefined =
              inventoryWand.wand.spells.reduce(
                (minUses: number | undefined, spell) => {
                  const usesRemaining = spell.usesRemaining;
                  if (usesRemaining === undefined || usesRemaining < 0)
                    return minUses;
                  if (minUses === undefined) return usesRemaining;

                  if (minUses === 0 && usesRemaining !== 0)
                    return usesRemaining;
                  if (usesRemaining < minUses && usesRemaining !== 0)
                    return usesRemaining;

                  return minUses;
                },
                undefined,
              );

            const wandImage = publicPaths.generated.wand.image({
              wandId: inventoryWand.wand.spriteId,
            });

            return (
              <NoitaTooltipWrapper
                content={
                  <NoitaWandCard wand={inventoryWand.wand} withoutCardBorder />
                }
              >
                <InventoryIcon
                  icon={wandImage}
                  size={50}
                  useOriginalIconSize
                  usesRemaining={usesRemaining}
                />
              </NoitaTooltipWrapper>
            );
          })}
        </Flex>
        <Flex column justify='end' gap={10}>
          <CurrentRunPlayerStatus />
          <CurrentRunPerksView />
        </Flex>
      </Flex>
    </>
  );
};
