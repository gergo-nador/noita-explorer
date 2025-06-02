import { useSave00Store } from '../../stores/save00.ts';
import { Flex } from '../../components/flex.tsx';

export const NoitaProgressTrackerSecrets = () => {
  const { unlockedOrbs, flags } = useSave00Store();

  return (
    <div style={{ padding: 10 }}>
      <h1>Secrets</h1>
      <h2>Unlocked Orbs</h2>
      <div>
        <Flex gap={5}>{unlockedOrbs?.map((o) => <span>{o}</span>)}</Flex>
      </div>
      <h2>Decoration</h2>
      <div>
        <div>
          Golden necklace: {flags?.has('secret_amulet') ? 'true' : 'false'}
        </div>
        <div>Amulet: {flags?.has('secret_amulet_gem') ? 'true' : 'false'}</div>
        <div>Crown: {flags?.has('secret_hat') ? 'true' : 'false'}</div>
      </div>
    </div>
  );
};
