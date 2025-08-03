import { Button, useToast } from '@noita-explorer/noita-component-library';
import { pages } from '../routes/pages';
import { useNoitaDataWakStore } from '../stores/noita-data-wak.ts';
import { noitaAPI } from '../noita-api.ts';
import { useSave00Store } from '../stores/save00.ts';
import { useMemo } from 'react';
import { Flex } from '@noita-explorer/react-utils';
import { dateHelpers } from '@noita-explorer/tools';
import { Link } from '../components/link.tsx';

export const MainPage = () => {
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
    <Flex center width='100%' height='100%' column gap={50}>
      <Flex center>
        <div
          style={{
            fontFamily: 'NoitaBlackletter',
            fontSize: 120,
            lineHeight: 'normal',
            background: dateHelpers.isPrideMonth()
              ? 'linear-gradient(to bottom, #FF3C17, #F93C17, #F1780B, #DCA301, #0B5A3B, #1E3C7B, #7B27B2, #7B27B2)'
              : 'linear-gradient(to bottom, #FFF190, #FFB660, #FFB760, #FF7759, #E75654, #B9474F)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
          }}
        >
          Noita Explorer
        </div>
      </Flex>
      <nav>
        <Flex center column gap={5}>
          {noitaAPI.environment.features.launchGame && (
            <Button onClick={() => noitaAPI.noita.launch.master()}>
              Launch Game
            </Button>
          )}
          {noitaAPI.environment.desktop && (
            <Link to={pages.setup.desktopPaths}>Setup</Link>
          )}
          {noitaAPI.environment.web && (
            <Link to={pages.setup.webPaths}>Setup</Link>
          )}

          <Link
            to={pages.progressTracker.index}
            disabled={!noitaDataWakLoaded}
            disabledToast='Noita Data is not set up. Loading...'
          >
            Progress {newProgress > 0 && <span>( {newProgress} )</span>}
          </Link>
          <Link
            to={pages.wiki.perks}
            disabled={!noitaDataWakLoaded}
            disabledToast='Noita Data is not set up. Loading...'
          >
            Wiki
          </Link>
          <Link
            to={pages.currentRun}
            disabled={
              !noitaDataWakLoaded || !currentRun || __ENV__ === 'production'
            }
            onDisabledClick={() => {
              if (__ENV__ === 'production') {
                toast.info(
                  "This page is still in development. If you want to view it's current state, check out the dev page",
                );
              } else if (!noitaDataWakLoaded) {
                toast.error(
                  'Noita Data is not set up. Please click on the Setup menu.',
                );
              } else if (!currentRun) {
                toast.error('No ongoing run detected.');
              }
            }}
          >
            Current Run
          </Link>
          <Link
            to={pages.sessions}
            disabled={save00Status !== 'loaded'}
            disabledToast='To view sessions you need to set up reading from save00 folder.'
          >
            Sessions
          </Link>
          <Link
            to={pages.deathMap}
            disabled={save00Status !== 'loaded'}
            disabledToast='To view death map you need to set up reading from save00 folder.'
          >
            Death Map
          </Link>
          <Link
            to={pages.bonesWands}
            disabled={save00Status !== 'loaded'}
            disabledToast='To view bones wands you need to set up reading from save00 folder.'
          >
            Bones Wands
          </Link>
          <Link to={pages.holidays}>Holidays</Link>
          <Link to={pages.settings.index}>Settings</Link>
          <Link to={pages.credits}>Credits</Link>
          {__ENV__ === 'development' && <Link to={pages.sandbox}>Sandbox</Link>}
        </Flex>
      </nav>
    </Flex>
  );
};
