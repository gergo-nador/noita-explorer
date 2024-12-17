import { Button, useToast } from '@noita-explorer/noita-component-library';
import { useNavigate } from 'react-router-dom';
import { pages } from '../routes/pages';
import { useNoitaDataWakStore } from '../stores/NoitaDataWak';
import { noitaAPI } from '../ipcHandlers.ts';

export const MainPage = () => {
  const navigate = useNavigate();
  const { loaded: noitaDataWakLoaded } = useNoitaDataWakStore();
  const toast = useToast();

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
            'Noita Data is not set up. Please click on the Setup menu',
          )
        }
      >
        Progress Tracker
      </Button>
      <Button
        disabled={!noitaDataWakLoaded}
        decoration={'both'}
        onClick={() => navigate(pages.progressTrackerV2.perks)}
        onDisabledClick={() =>
          toast.error(
            'Noita Data is not set up. Please click on the Setup menu',
          )
        }
      >
        Progress Tracker V2
      </Button>
      <Button decoration={'both'} onClick={() => navigate(pages.holidays)}>
        Holidays
      </Button>
    </div>
  );
};
