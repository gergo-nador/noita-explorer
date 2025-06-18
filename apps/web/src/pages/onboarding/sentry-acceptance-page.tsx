import { Button, Card, Icon } from '@noita-explorer/noita-component-library';
import { PageBottomComponent } from '../../components/page-bottom-component.tsx';
import { useSettingsStore } from '../../stores/settings.ts';

export const SentryAcceptancePage = () => {
  const { set } = useSettingsStore();

  const onRejectedClick = () => {
    set((settings) => (settings.sentry.initialPopupSeen = true));
  };

  const onOptInClick = () => {
    set(
      (settings) => {
        settings.sentry.initialPopupSeen = true;
        settings.sentry.enabled = true;
      },
      { skipUpdateState: true },
    ).then(() => location.reload());
  };

  return (
    <Card style={{ maxWidth: '500px' }}>
      <h2>
        <span>Anonymous Bug Tracking </span>
        <Icon type='error' size={25} />
      </h2>
      <div>As Noita Explorer is a software, it contains bugs.</div>
      <br />
      <div>
        We are constantly fixing them, and you can help us doing it faster by
        sending us anonymised bug reports. We don't collect data about you, we
        collect about our own application and its errors.
      </div>
      <br />
      <div>
        You can opt-in to bug reports by pressing the Accept button below.
      </div>
      <br />
      <div>
        Note: Pressing "Yes" will refresh the page to enable our reporting
        system.
      </div>
      <PageBottomComponent>
        <Button decoration={'right'} onClick={onRejectedClick}>
          No
        </Button>
        <Button decoration={'right'} onClick={onOptInClick}>
          Yes, let's help the developers!
        </Button>
      </PageBottomComponent>
    </Card>
  );
};
