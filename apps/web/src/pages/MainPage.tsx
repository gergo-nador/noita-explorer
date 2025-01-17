import { Button, useToast } from '@noita-explorer/noita-component-library';
import { useNavigate } from 'react-router-dom';
import { pages } from '../routes/pages';
import { useNoitaDataWakStore } from '../stores/NoitaDataWak';
import { noitaAPI } from '../ipcHandlers.ts';
import { useSave00Store } from '../stores/save00.ts';
import { useMemo } from 'react';

export const MainPage = () => {
  const navigate = useNavigate();
  const { loaded: noitaDataWakLoaded, data } = useNoitaDataWakStore();
  const { loaded: save00Loaded, currentRun } = useSave00Store();
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
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 5,
      }}
    >
      {!!noitaAPI.environment.desktop && (
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
        onClick={() => navigate(pages.progressTrackerV2.perks)}
        onDisabledClick={() =>
          toast.error(
            'Noita Data is not set up. Please click on the Setup menu.',
          )
        }
      >
        Progress V2
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
        disabled={!save00Loaded}
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
        disabled={!save00Loaded}
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
        disabled={!save00Loaded}
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
    </div>
  );
};
