import { Button, useToast } from '@noita-explorer/noita-component-library';
import { useNavigate } from 'react-router-dom';
import { pages } from '../routes/pages';
import { useNoitaDataWakStore } from '../stores/NoitaDataWak';

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
      <Button decoration={'both'} onClick={() => navigate(pages.setup.paths)}>
        Setup
      </Button>
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
        onClick={() => navigate(pages.progressTrackerV2)}
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
