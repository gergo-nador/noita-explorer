import { Flex } from '@noita-explorer/react-utils';
import { MultiSelectionBoolean } from '@noita-explorer/noita-component-library';
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
  const { progressDisplayDebugData, sentry: sentrySettings } = settings;

  const makeBugReportSeen = () => {
    if (settings.sentry.initialPopupSeen) {
      return;
    }

    set((settings) => (settings.sentry.initialPopupSeen = true));
  };

  return (
    <Header
      title={'Extras' + (settings.sentry.initialPopupSeen ? '' : ' ( 1 )')}
    >
      <Flex style={{ width: 'max-content' }} gap={20}>
        <span>Display Debug Info: </span>
        <MultiSelectionBoolean
          setValue={(value) => set((s) => (s.progressDisplayDebugData = value))}
          currentValue={progressDisplayDebugData}
        />
      </Flex>
      <br />
      <Flex
        style={{ width: 'max-content' }}
        gap={20}
        onMouseEnter={makeBugReportSeen}
      >
        <Flex gap={5}>
          <span>Send anonymous error logs</span>
          {!settings.sentry.initialPopupSeen && <span> ( 1 )</span>}
          <span>: </span>
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
        <MultiSelectionBoolean
          setValue={(value) => set((s) => (s.sentry.enabled = value))}
          currentValue={sentrySettings.enabled}
        />
        {sentry.isSentryEnabled !== sentrySettings.enabled && (
          <Button onClick={() => location.reload()}>
            Refresh page to apply changes
          </Button>
        )}
        {sentry.isSentryEnabled && !sentry.hasSentryInitialized && (
          <NoitaTooltipWrapper content='Sentry has not been initialized'>
            <Icon type='error' size={16} />
          </NoitaTooltipWrapper>
        )}
      </Flex>
    </Header>
  );
};
