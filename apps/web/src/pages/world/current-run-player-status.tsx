import {
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { ProgressBar } from '@noita-explorer/noita-component-library';
import { useSave00Store } from '../../stores/save00.ts';
import { mathHelpers } from '@noita-explorer/tools';
import { Flex } from '@noita-explorer/react-utils';

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
        alignItems: 'center',
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
        <HudIcon alt='Health' type='health' />
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
          <HudIcon alt='Jetpack' type='jetpack' />
          <div />
        </>
      )}
      {currentRun.worldState.orbsFound.length > 0 && (
        <>
          <div />
          <HudIcon alt='Orbs' type='orbs' />
          <div>{currentRun.worldState.orbsFound.length}</div>
        </>
      )}
      {currentRun.playerState.wallet && (
        <>
          <div />
          <HudIcon alt='Money' type='money' />
          <NoitaTooltipWrapper
            content={
              <div>
                <div>
                  <span>Money: </span>
                  {currentRun.playerState.wallet.hasReachedInfinite && '∞'}
                  {!currentRun.playerState.wallet.hasReachedInfinite && (
                    <span>{currentRun.playerState.wallet.money}</span>
                  )}
                </div>
                <div>
                  <span>Money spent: </span>
                  {currentRun.playerState.wallet.moneySpent}
                </div>
                <div>
                  <span>Money all: </span>
                  {currentRun.playerState.wallet.hasReachedInfinite && '∞'}
                  {!currentRun.playerState.wallet.hasReachedInfinite && (
                    <span>
                      {currentRun.playerState.wallet.money +
                        currentRun.playerState.wallet.moneySpent}
                    </span>
                  )}
                </div>
              </div>
            }
          >
            {currentRun.playerState.wallet.hasReachedInfinite
              ? '∞'
              : displayMoneyTruncated(currentRun.playerState.wallet.money)}
          </NoitaTooltipWrapper>
        </>
      )}
    </Flex>
  );
};

const HudIcon = ({ alt, type }: { alt: string; type: string }) => {
  return (
    <Flex center>
      <Icon alt={alt} src={`/images/hud/${type}.png`} size={20} />
    </Flex>
  );
};

const displayMoneyTruncated = (money: number): string => {
  if (money < 1_000) {
    return money.toString();
  }

  if (money < 1_000_000) {
    const kDisplay = mathHelpers.floor(money / 1_000);
    return kDisplay + 'K';
  }

  const mDisplay = mathHelpers.floor(money / 1_000_000);
  return mDisplay + 'M';
};
