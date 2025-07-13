import { PlayerDecorations } from './components/player-decorations.tsx';
import { Header } from '@noita-explorer/noita-component-library';
import { ProgressOrbs } from './components/ProgressOrbs.tsx';

export const NoitaProgressTrackerSecrets = () => {
  return (
    <div style={{ padding: 10 }}>
      <h1>Secrets</h1>
      <Header title='Decorations'>
        <PlayerDecorations />
      </Header>
      <Header title='Orbs'>
        <ProgressOrbs />
      </Header>
    </div>
  );
};
