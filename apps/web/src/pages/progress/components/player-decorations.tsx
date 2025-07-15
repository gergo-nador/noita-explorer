import { CSSProperties, useRef, useState } from 'react';
import {
  BooleanIcon,
  Button,
  PixelatedImage,
} from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { useSave00Store } from '../../../stores/save00.ts';
import { useNoitaActionsStore } from '../../../stores/actions.ts';
import { publicPaths } from '../../../utils/public-paths.ts';

export const PlayerDecorations = () => {
  const { flags, currentRun } = useSave00Store();
  const { actionUtils } = useNoitaActionsStore();

  const decorations = [
    {
      label: 'Crown',
      flag: 'secret_hat',
      isUnlockedForCurrentRun:
        currentRun?.playerState?.decorations?.player_hat2,
      existingAction: actionUtils.playerDecoration.get('secret_hat'),
      unlock: (permanent: boolean) => {
        const existingAction = actionUtils.playerDecoration.get('secret_hat');
        if (existingAction) {
          actionUtils.removeAction(existingAction);
        }

        actionUtils.playerDecoration.create('secret_hat', permanent);
      },
    },
    {
      label: 'Golden Necklace',
      flag: 'secret_amulet',
      isUnlockedForCurrentRun:
        currentRun?.playerState?.decorations?.player_amulet,
      existingAction: actionUtils.playerDecoration.get('secret_amulet'),
      unlock: (permanent: boolean) => {
        const existingAction =
          actionUtils.playerDecoration.get('secret_amulet');
        if (existingAction) {
          actionUtils.removeAction(existingAction);
        }

        actionUtils.playerDecoration.create('secret_amulet', permanent);
      },
    },
    {
      label: 'Amulet Gem',
      flag: 'secret_amulet_gem',
      isUnlockedForCurrentRun:
        currentRun?.playerState?.decorations?.player_amulet_gem,
      existingAction: actionUtils.playerDecoration.get('secret_amulet_gem'),
      unlock: (permanent: boolean) => {
        const existingAction =
          actionUtils.playerDecoration.get('secret_amulet_gem');
        if (existingAction) {
          actionUtils.removeAction(existingAction);
        }

        actionUtils.playerDecoration.create('secret_amulet_gem', permanent);
      },
    },
  ];

  return (
    <Flex>
      <div style={{ padding: '0 20px' }}>
        <PlayerImage
          size={100}
          amulet={
            flags?.has('secret_amulet') ||
            actionUtils.playerDecoration.isOnList('secret_amulet') ||
            currentRun?.playerState?.decorations?.player_amulet?.enabled
          }
          amuletGem={
            flags?.has('secret_amulet_gem') ||
            actionUtils.playerDecoration.isOnList('secret_amulet_gem') ||
            currentRun?.playerState?.decorations?.player_amulet_gem?.enabled
          }
          crown={
            flags?.has('secret_hat') ||
            actionUtils.playerDecoration.isOnList('secret_hat') ||
            currentRun?.playerState?.decorations?.player_hat2?.enabled
          }
        />
      </div>
      <Flex direction='column' gap={10}>
        {decorations.map((decoration) => {
          const isUnlockedPermanently = flags?.has(decoration.flag) ?? false;
          const canBeUnlockedPermanently =
            Boolean(flags) && !isUnlockedPermanently;
          const isUnlockedInThisRun =
            decoration.isUnlockedForCurrentRun?.enabled ?? false;
          const canBeUnlockedForThisRun =
            Boolean(currentRun) && !isUnlockedInThisRun;
          const isUnlockedFully = isUnlockedPermanently && isUnlockedInThisRun;

          const action = decoration.existingAction;

          return (
            <Flex gap={5}>
              <span className={isUnlockedFully ? 'text-success' : ''}>
                {decoration.label}
              </span>
              <BooleanIcon
                value={isUnlockedPermanently || isUnlockedInThisRun}
              />
              {!isUnlockedPermanently && isUnlockedInThisRun && (
                <span>(unlocked for current run)</span>
              )}

              {(canBeUnlockedPermanently || canBeUnlockedForThisRun) && (
                <Flex gap={10} style={{ paddingLeft: 20 }}>
                  <span>Unlock: </span>
                  {canBeUnlockedPermanently && (
                    <Button
                      onClick={() => decoration.unlock(true)}
                      disabled={
                        decoration.existingAction &&
                        decoration.existingAction.payload.permanent
                      }
                      onDisabledClick={() =>
                        action && actionUtils.removeAction(action)
                      }
                    >
                      permanently
                    </Button>
                  )}
                  {canBeUnlockedPermanently && canBeUnlockedForThisRun && (
                    <span> / </span>
                  )}
                  {canBeUnlockedForThisRun && (
                    <Button
                      onClick={() => decoration.unlock(false)}
                      disabled={
                        decoration.existingAction &&
                        !decoration.existingAction.payload.permanent
                      }
                      onDisabledClick={() =>
                        action && actionUtils.removeAction(action)
                      }
                    >
                      this run only
                    </Button>
                  )}
                </Flex>
              )}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

const PlayerImage = ({
  size,
  amulet,
  amuletGem,
  crown,
}: {
  size: number;
  amulet: boolean | undefined;
  amuletGem: boolean | undefined;
  crown: boolean | undefined;
}) => {
  const [gifName, setGifName] = useState('stand');
  const overlayStyle: CSSProperties = { position: 'absolute', top: 0, left: 0 };

  // whenever the component is re-rendered (the arguments change)
  // restart all the gif animations so the newly added animation is synchronized
  const ref = useRef(0);
  ref.current += 1;

  const getGifPath = (enemyId: string) =>
    publicPaths.enemyGifs({
      enemyId: enemyId,
      gifName: gifName,
      gifReloadCounter: ref.current,
    }).gif;

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setGifName('walk')}
      onMouseLeave={() => setGifName('stand')}
    >
      <PixelatedImage src={getGifPath('player')} height={size} />
      {(amulet || amuletGem) && (
        <PixelatedImage
          src={getGifPath('player_amulet')}
          height={size}
          style={overlayStyle}
        />
      )}
      {amuletGem && (
        <PixelatedImage
          src={getGifPath('player_amulet_gem')}
          height={size}
          style={overlayStyle}
        />
      )}
      {crown && (
        <>
          <PixelatedImage
            src={getGifPath('player_hat2')}
            height={size}
            style={overlayStyle}
          />
          <PixelatedImage
            src={getGifPath('player_hat2_shadow')}
            height={size}
            style={overlayStyle}
          />
        </>
      )}
    </div>
  );
};
