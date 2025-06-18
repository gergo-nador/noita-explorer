import { Button, Card, Icon } from '@noita-explorer/noita-component-library';
import { PageBottomComponent } from '../../components/page-bottom-component.tsx';
import { useSettingsStore } from '../../stores/settings.ts';

export const SpoilerWarningPage = () => {
  const { set } = useSettingsStore();

  const continueClick = () => {
    set((settings) => (settings.spoilerWarningAccepted = true));
  };

  return (
    <Card style={{ maxWidth: '500px' }}>
      <h2>
        <Icon type={'warning'} size={25} />
        <span> SPOILER WARNING </span>
        <Icon type={'warning'} size={25} />
      </h2>
      <div>
        This page contains major spoilers for Noita! It includes detailed
        information on unlockable content, secrets, and progression mechanics.
        If you prefer to discover everything on your own, we strongly recommend
        playing the game first before proceeding.
      </div>
      <br />
      <div>
        <b>Continue at your own risk!</b>
      </div>

      <PageBottomComponent>
        <Button decoration={'right'} onClick={continueClick}>
          Click here to continue
        </Button>
      </PageBottomComponent>
    </Card>
  );
};
