import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import { CurrentRunPerksView } from './current-run-perks-view.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { useSave00Store } from '../../stores/save00.ts';
import { CurrentRunPlayerStatus } from './current-run-player-status.tsx';
import { CurrentRunQuickInventory } from './current-run-quick-inventory.tsx';

export const CurrentRun = () => {
  const { data } = useNoitaDataWakStore();
  const { currentRun } = useSave00Store();

  if (!data) {
    return <div>Data wak is still loading...</div>;
  }

  if (!currentRun) {
    return <div>No current run detected.</div>;
  }

  console.log(currentRun);
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
