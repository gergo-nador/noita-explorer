import { CurrentRunPerksView } from './current-run-perks-view.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { useSave00Store } from '../../stores/save00.ts';
import { CurrentRunPlayerStatus } from './current-run-player-status.tsx';
import { CurrentRunQuickInventory } from './current-run-quick-inventory.tsx';

export const CurrentRun = () => {
  const { currentRun } = useSave00Store();

  if (!currentRun) {
    return <div>No current run detected.</div>;
  }

  return (
    <>
      <Flex justify='space-between'>
        <CurrentRunQuickInventory />
        <Flex column justify='end' gap={10}>
          <CurrentRunPlayerStatus />
          <CurrentRunPerksView />
        </Flex>
      </Flex>
    </>
  );
};
