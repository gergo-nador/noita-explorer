import { useSave00Store } from '../../stores/save00.ts';
import { Flex } from '@noita-explorer/react-utils';
import { PlayerDecorations } from './components/player-decorations.tsx';

export const NoitaProgressTrackerSecrets = () => {
  const { unlockedOrbs } = useSave00Store();

  return (
    <div style={{ padding: 10 }}>
      <h1>Secrets</h1>
      <h2>Unlocked Orbs</h2>
      <div>
        <Flex gap={5} wrap='wrap'>
          {unlockedOrbs?.map((o) => (
            <span key={o}>{o}</span>
          ))}
        </Flex>
      </div>
      <h2>Decoration</h2>
      <PlayerDecorations />
    </div>
  );
};
