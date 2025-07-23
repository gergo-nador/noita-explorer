import { PlayerDecorations } from './components/player-decorations.tsx';
import { Header } from '@noita-explorer/noita-component-library';
import { ProgressOrbs } from './components/progress-orbs.tsx';

export const NoitaProgressTrackerSecrets = () => {
  return (
    <div style={{ padding: 10 }}>
      <Header title='Decorations'>
        <PlayerDecorations />
      </Header>
      <Header title='Orbs'>
        <ProgressOrbs />
      </Header>
    </div>
  );
};
