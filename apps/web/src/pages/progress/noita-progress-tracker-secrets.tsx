import player from '../../assets/player/player.png';
import playerAmulet from '../../assets/player/player_amulet.png';
import playerAmuletGem from '../../assets/player/player_amulet_gem.png';
import playerCrown from '../../assets/player/player_crown.png';

import { useSave00Store } from '../../stores/save00.ts';
import { Flex } from '../../components/flex.tsx';
import {
  Button,
  PixelatedImage,
} from '@noita-explorer/noita-component-library';
import { CSSProperties } from 'react';
import { BooleanIcon } from '../../components/boolean-icon.tsx';
import { useNoitaActionsStore } from '../../stores/actions.ts';

export const NoitaProgressTrackerSecrets = () => {
  const { unlockedOrbs } = useSave00Store();

  return (
    <div style={{ padding: 10 }}>
      <h1>Secrets</h1>
      <h2>Unlocked Orbs</h2>
      <div>
        <Flex gap={5} wrap='wrap'>
          {unlockedOrbs?.map((o) => <span key={o}>{o}</span>)}
        </Flex>
      </div>
      <h2>Decoration</h2>
      <PlayerDecorations />
    </div>
  );
};

const PlayerDecorations = () => {
  const { flags, currentRun } = useSave00Store();
  const { actionUtils } = useNoitaActionsStore();

  const decorations = [
    {
      label: 'Golden Necklace',
      flag: 'secret_amulet',
      existingAction: actionUtils.playerDecoration.get('amulet'),
      unlock: (permanent: boolean) => {
        const existingAction = actionUtils.playerDecoration.get('amulet');
        if (existingAction) {
          actionUtils.removeAction(existingAction);
        }

        actionUtils.playerDecoration.create('amulet', permanent);
      },
    },
    {
      label: 'Amulet Gem',
      flag: 'secret_amulet_gem',
      existingAction: actionUtils.playerDecoration.get('amulet_gem'),
      unlock: (permanent: boolean) => {
        const existingAction = actionUtils.playerDecoration.get('amulet_gem');
        if (existingAction) {
          actionUtils.removeAction(existingAction);
        }

        actionUtils.playerDecoration.create('amulet_gem', permanent);
      },
    },
    {
      label: 'Crown',
      flag: 'secret_hat',
      existingAction: actionUtils.playerDecoration.get('crown'),
      unlock: (permanent: boolean) => {
        const existingAction = actionUtils.playerDecoration.get('crown');
        if (existingAction) {
          actionUtils.removeAction(existingAction);
        }

        actionUtils.playerDecoration.create('crown', permanent);
      },
    },
  ];

  return (
    <Flex>
      <div style={{ padding: '0 20px' }}>
        <PlayerImage
          size={100}
          amulet={flags?.has('secret_amulet')}
          amuletGem={flags?.has('secret_amulet_gem')}
          crown={flags?.has('secret_hat')}
        />
      </div>
      <Flex direction='column' gap={10}>
        {decorations.map((decoration) => {
          const hasFlag = flags?.has(decoration.flag) ?? false;
          return (
            <Flex gap={5}>
              <span className={hasFlag ? 'text-success' : ''}>
                {decoration.label}
              </span>
              <BooleanIcon value={hasFlag} />

              {!hasFlag && (
                <Flex gap={10} style={{ paddingLeft: 20 }}>
                  <span>Unlock: </span>
                  <Button
                    onClick={() => decoration.unlock(true)}
                    disabled={
                      decoration.existingAction &&
                      decoration.existingAction.payload.permanent
                    }
                  >
                    permanently
                  </Button>
                  {currentRun && (
                    <>
                      <span> / </span>
                      <Button
                        onClick={() => decoration.unlock(false)}
                        disabled={
                          decoration.existingAction &&
                          !decoration.existingAction.payload.permanent
                        }
                      >
                        this run only
                      </Button>
                    </>
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
  const overlayStyle: CSSProperties = { position: 'absolute', top: 0, left: 0 };
  return (
    <div style={{ position: 'relative' }}>
      <PixelatedImage src={player} height={size} />
      {(amulet || amuletGem) && (
        <PixelatedImage src={playerAmulet} height={size} style={overlayStyle} />
      )}
      {amuletGem && (
        <PixelatedImage
          src={playerAmuletGem}
          height={size}
          style={overlayStyle}
        />
      )}
      {crown && (
        <PixelatedImage src={playerCrown} height={size} style={overlayStyle} />
      )}
    </div>
  );
};
