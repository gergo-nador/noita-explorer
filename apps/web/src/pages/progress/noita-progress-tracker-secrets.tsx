import player from '../../assets/player/player.png';
import playerAmulet from '../../assets/player/player_amulet.png';
import playerAmuletGem from '../../assets/player/player_amulet_gem.png';
import playerCrown from '../../assets/player/player_crown.png';

import { useSave00Store } from '../../stores/save00.ts';
import { Flex } from '../../components/flex.tsx';
import { PixelatedImage } from '@noita-explorer/noita-component-library';
import { CSSProperties } from 'react';
import { BooleanIcon } from '../../components/boolean-icon.tsx';

export const NoitaProgressTrackerSecrets = () => {
  const { unlockedOrbs, flags } = useSave00Store();

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
      <Flex>
        <div>
          <div>
            Golden necklace: <BooleanIcon value={flags?.has('secret_amulet')} />
          </div>
          <div>
            Amulet: <BooleanIcon value={flags?.has('secret_amulet_gem')} />
          </div>
          <div>
            Crown: <BooleanIcon value={flags?.has('secret_hat')} />
          </div>
        </div>
        <div style={{ paddingLeft: 100 }}>
          <PlayerImage
            size={100}
            amulet={flags?.has('secret_amulet')}
            amuletGem={flags?.has('secret_amulet_gem')}
            crown={flags?.has('secret_hat')}
          />
        </div>
      </Flex>
    </div>
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
