import { Flex } from '../../components/flex.tsx';
import { MultiSelection } from '../../components/multi-selection/multi-selection.tsx';
import { useSettingsStore } from '../../stores/settings.ts';
import {
  Button,
  Header,
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { sentry } from '../../utils/sentry.ts';

export const SettingsExtras = () => {
  const { settings, set } = useSettingsStore();
  const { progressDisplayDebugData, useSentry } = settings;

  return (
    <Header title={'Extras'}>
      <Flex style={{ width: 'max-content' }} gap={20}>
        <span>Display Debug Info: </span>
        <MultiSelection<boolean>
          options={[
            {
              id: 'no',
              display: 'No',
              value: false,
            },
            {
              id: 'yes',
              display: 'Yes',
              value: true,
            },
          ]}
          setValue={(value) => set((s) => (s.progressDisplayDebugData = value))}
          currentValue={progressDisplayDebugData}
        />
      </Flex>
      <br />
      <Flex style={{ width: 'max-content' }} gap={20}>
        <Flex gap={5}>
          <span>Send anonymous error logs: </span>
          <NoitaTooltipWrapper
            content={
              <>
                <div>
                  If yes, the application sends anonymised error logs in case
                  the application crashes.
                </div>
                <div>This helps fixing bugs quicker!</div>
                <div>Note: Changes apply after refreshing the page.</div>
              </>
            }
          >
            <Icon type='info' />
          </NoitaTooltipWrapper>
        </Flex>
        <MultiSelection<boolean>
          options={[
            {
              id: 'no',
              display: 'No',
              value: false,
            },
            {
              id: 'yes',
              display: 'Yes',
              value: true,
            },
          ]}
          setValue={(value) => set((s) => (s.useSentry = value))}
          currentValue={useSentry}
        />
        {sentry.hasSentryInitialized !== useSentry && (
          <Button onClick={() => location.reload()}>
            Refresh page to apply changes
          </Button>
        )}
      </Flex>
    </Header>
  );
};
