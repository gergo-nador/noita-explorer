import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import {
  InventoryIcon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { CurrentRunPerksView } from './current-run-perks-view.tsx';
import { Flex } from '../../components/flex.tsx';
import { useSave00Store } from '../../stores/save00.ts';
import { NoitaWandCard } from '../../components/noita-wand-card.tsx';
import { CurrentRunPlayerStatus } from './current-run-player-status.tsx';

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
    <div>
      <div>
        <Flex gap={5}>
          {currentRun.playerState.inventory.wands.map((inventoryWand) => (
            <NoitaTooltipWrapper
              content={
                <NoitaWandCard wand={inventoryWand.wand} withoutCardBorder />
              }
            >
              <InventoryIcon
                icon={
                  data.wandConfigs.find(
                    (w) => w.spriteId === inventoryWand.wand.spriteId,
                  )?.imageBase64
                }
                size={50}
                useOriginalIconSize
              />
            </NoitaTooltipWrapper>
          ))}
        </Flex>
        <CurrentRunPlayerStatus />
        <CurrentRunPerksView />
      </div>
    </div>
  );
};
