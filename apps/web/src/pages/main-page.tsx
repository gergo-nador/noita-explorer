import { Button, useToast } from '@noita-explorer/noita-component-library';
import { useNavigate } from 'react-router-dom';
import { pages } from '../routes/pages';
import { useNoitaDataWakStore } from '../stores/noita-data-wak.ts';
import { noitaAPI } from '../noita-api.ts';
import { useSave00Store } from '../stores/save00.ts';
import { useMemo } from 'react';
import { Flex } from '../components/flex.tsx';

export const MainPage = () => {
  const navigate = useNavigate();
  const { loaded: noitaDataWakLoaded, data } = useNoitaDataWakStore();
  const { status: save00Status, currentRun } = useSave00Store();
  const toast = useToast();

  const newProgress = useMemo(() => {
    if (!currentRun) {
      return 0;
    }

    let count = 0;
    count += currentRun.worldState.flags.newActionIds.length;
    count += currentRun.worldState.flags.newPerkIds.length;

    if (data) {
      const enemyIds = data.enemies.map((e) => e.id);
      count += currentRun?.worldState.flags.newEnemyIds.filter((e) =>
        enemyIds.includes(e),
      ).length;
    }
    return count;
  }, [currentRun, data]);

  return (
    <Flex width='100%' height='100%' center direction='column' gap={5}>
      {noitaAPI.environment.features.launchGame && (
        <Button onClick={() => noitaAPI.noita.launch.master()}>
          Launch Game
        </Button>
      )}
      {!!noitaAPI.environment.desktop && (
        <Button
          decoration={'both'}
          onClick={() => navigate(pages.setup.desktopPaths)}
        >
          Setup
        </Button>
      )}
      {noitaAPI.environment.web && (
        <Button
          decoration={'both'}
          onClick={() => navigate(pages.setup.webPaths)}
        >
          Setup
        </Button>
      )}

      <Button
        disabled={!noitaDataWakLoaded}
        decoration={'both'}
        onClick={() => navigate(pages.progressTracker)}
        onDisabledClick={() =>
          toast.error(
            'Noita Data is not set up. Please click on the Setup menu.',
          )
        }
      >
        Progress {newProgress > 0 && <span>( {newProgress} )</span>}
      </Button>
      <Button
        decoration={'both'}
        disabled={!noitaDataWakLoaded}
        onClick={() => navigate(pages.wiki.perks)}
        onDisabledClick={() =>
          toast.error(
            'Noita Data is not set up. Please click on the Setup menu.',
          )
        }
      >
        Wiki
      </Button>
      <Button
        decoration={'both'}
        disabled={!noitaDataWakLoaded || !currentRun}
        onClick={() => navigate(pages.currentRun)}
        onDisabledClick={() => {
          if (!noitaDataWakLoaded) {
            toast.error(
              'Noita Data is not set up. Please click on the Setup menu.',
            );
          } else if (!currentRun) {
            toast.error('No ongoing run detected.');
          }
        }}
      >
        Current Run
      </Button>
      <Button decoration={'both'} onClick={() => navigate(pages.holidays)}>
        Holidays
      </Button>
      <Button
        decoration={'both'}
        disabled={save00Status !== 'loaded'}
        onClick={() => navigate(pages.sessions)}
        onDisabledClick={() =>
          toast.error(
            'To view sessions you need to set up reading from save00 folder.',
          )
        }
      >
        Sessions
      </Button>
      <Button
        decoration={'both'}
        disabled={save00Status !== 'loaded'}
        onClick={() => navigate(pages.deathMap)}
        onDisabledClick={() =>
          toast.error(
            'To view death map you need to set up reading from save00 folder.',
          )
        }
      >
        Death Map
      </Button>
      <Button
        decoration={'both'}
        disabled={save00Status !== 'loaded'}
        onClick={() => navigate(pages.bonesWands)}
        onDisabledClick={() =>
          toast.error(
            'To view bones wands you need to set up reading from save00 folder.',
          )
        }
      >
        Bones Wands
      </Button>
      <Button decoration={'both'} onClick={() => navigate(pages.settings.main)}>
        Settings
      </Button>
      <Button decoration={'both'} onClick={() => navigate(pages.credits)}>
        Credits
      </Button>
    </Flex>
  );
};
