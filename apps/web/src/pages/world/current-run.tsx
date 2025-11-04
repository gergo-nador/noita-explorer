import { CurrentRunPerksView } from './current-run-perks-view.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { CurrentRunPlayerStatus } from './current-run-player-status.tsx';
import { CurrentRunQuickInventory } from './current-run-quick-inventory.tsx';

export const CurrentRun = () => {
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
