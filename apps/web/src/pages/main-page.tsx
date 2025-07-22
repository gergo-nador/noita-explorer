import { Button, useToast } from '@noita-explorer/noita-component-library';
import { useNavigate } from 'react-router-dom';
import { pages } from '../routes/pages';
import { useNoitaDataWakStore } from '../stores/noita-data-wak.ts';
import { noitaAPI } from '../noita-api.ts';
import { useSave00Store } from '../stores/save00.ts';
import { useMemo } from 'react';
import { Flex } from '@noita-explorer/react-utils';
import { dateHelpers } from '@noita-explorer/tools';

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
      <Flex center column gap={5}>
        <div>
          <div>{__DEPLOY_COMMIT__}</div>
          <div>{__DEPLOY_ID__}</div>
          <div>{__ENV__}</div>
        </div>
        {noitaAPI.environment.features.launchGame && (
          <Button onClick={() => noitaAPI.noita.launch.master()}>
            Launch Game
          </Button>
        )}
        {!!noitaAPI.environment.desktop && (
          <Button onClick={() => navigate(pages.setup.desktopPaths)}>
            Setup
          </Button>
        )}
        {noitaAPI.environment.web && (
          <Button onClick={() => navigate(pages.setup.webPaths)}>Setup</Button>
        )}

        <Button
          disabled={!noitaDataWakLoaded}
          onClick={() => navigate(pages.progressTracker.index)}
          onDisabledClick={() =>
            toast.error(
              'Noita Data is not set up. Please click on the Setup menu.',
            )
          }
        >
          Progress {newProgress > 0 && <span>( {newProgress} )</span>}
        </Button>
        <Button
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
          disabled={
            !noitaDataWakLoaded || !currentRun || __ENV__ === 'production'
          }
          onClick={() => navigate(pages.currentRun)}
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
        </Button>
        <Button
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
        <Button onClick={() => navigate(pages.holidays)}>Holidays</Button>
        <Button onClick={() => navigate(pages.settings.index)}>Settings</Button>
        <Button onClick={() => navigate(pages.credits)}>Credits</Button>
        {__ENV__ === 'development' && (
          <Button onClick={() => navigate(pages.sandbox)}>Sandbox</Button>
        )}
      </Flex>
    </Flex>
  );
};
