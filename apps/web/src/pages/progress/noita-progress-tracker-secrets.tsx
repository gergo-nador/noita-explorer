import { useSave00Store } from '../../stores/save00.ts';
import { Flex } from '../../components/flex.tsx';

export const NoitaProgressTrackerSecrets = () => {
  const { unlockedOrbs } = useSave00Store();

  return (
    <div>
      <h1>Secrets</h1>
      <h2>Unlocked Orbs</h2>
      <div>
        <Flex gap={5}>{unlockedOrbs?.map((o) => <span>{o}</span>)}</Flex>
      </div>
      <h2>Decoration</h2>
      <div>
        <div>Golden necklace</div>
        <div>Amulet</div>
        <div>Crown</div>
      </div>
    </div>
  );
};
