import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import {
  Icon,
  InventoryIcon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { CurrentRunPerksView } from './current-run-perks-view.tsx';
import { Flex } from '../../components/flex.tsx';
import { useSave00Store } from '../../stores/save00.ts';
import { NoitaWandCard } from '../../components/noita-wand-card.tsx';
import { ProgressBar } from '../../components/progress-bar.tsx';

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
        <div
          style={{ display: 'grid', gridTemplateColumns: '300px 20px 50px' }}
        >
          <div>
            <NoitaTooltipWrapper
              content={`${currentRun.playerState.damageModel.hp}/${currentRun.playerState.damageModel.maxHp}`}
              placement='left'
            >
              <ProgressBar
                progress={
                  (100 * currentRun.playerState.damageModel.hp) /
                  currentRun.playerState.damageModel.maxHp
                }
                barColor='healthBar'
                width='300px'
              />
            </NoitaTooltipWrapper>
          </div>
          <div>
            <Icon type={'custom'} alt={'Health'} />
          </div>
          <div>Health</div>
        </div>
        <CurrentRunPerksView />
      </div>
    </div>
  );
};
