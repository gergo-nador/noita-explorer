import healthIcon from '../../assets/hud/health.png';
import jetpackIcon from '../../assets/hud/jetpack.png';
import orbsIcon from '../../assets/hud/orbs.png';

import {
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { ProgressBar } from '../../components/progress-bar.tsx';
import { useSave00Store } from '../../stores/save00.ts';
import { mathHelpers } from '@noita-explorer/tools';
import { Flex } from '../../components/flex.tsx';

export const CurrentRunPlayerStatus = () => {
  const { currentRun } = useSave00Store();

  if (!currentRun) {
    return <div>No current run detected.</div>;
  }

  const fly = currentRun.playerState.fly;

  return (
    <Flex
      style={{
        display: 'grid',
        gridTemplateColumns: '300px 25px 50px',
        gap: '8px 0',
      }}
    >
      <>
        <Flex justify='end'>
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
        </Flex>
        <HudIcon alt='Health' src={healthIcon} />
        <div>{mathHelpers.round(currentRun.playerState.damageModel.hp)}</div>
      </>
      {fly && (
        <>
          <Flex justify='end'>
            <NoitaTooltipWrapper
              content={
                <Flex direction='column' align='center'>
                  <div>
                    {mathHelpers.round(
                      (100 * fly.flyingTimeLeft) / fly.flyTimeMax,
                      2,
                    )}
                    /100
                  </div>
                  <div style={{ opacity: 0.7 }}>
                    {fly.flyingTimeLeft}/{fly.flyTimeMax}
                  </div>
                </Flex>
              }
              placement='left'
            >
              <ProgressBar
                progress={mathHelpers.round(
                  (100 * fly.flyingTimeLeft) / fly.flyTimeMax,
                )}
                barColor='flyingBar'
                width='150px'
                height='15px'
              />
            </NoitaTooltipWrapper>
          </Flex>
          <HudIcon alt='Jetpack' src={jetpackIcon} />
          <div />
        </>
      )}
      {currentRun.worldState.orbsFound.length > 0 && (
        <>
          <div />
          <HudIcon alt='Orbs' src={orbsIcon} />
          <div>{currentRun.worldState.orbsFound.length}</div>
        </>
      )}
    </Flex>
  );
};

const HudIcon = ({ alt, src }: { alt: string; src: string }) => {
  return (
    <Flex center>
      <Icon type='custom' alt={alt} src={src} size={20} />
    </Flex>
  );
};
