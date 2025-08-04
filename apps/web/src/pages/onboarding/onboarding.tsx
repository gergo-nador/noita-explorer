import { useRef } from 'react';
import { useSettingsStore } from '../../stores/settings.ts';
import { SpoilerWarningPage } from './spoiler-warning-page.tsx';
import { SentryAcceptancePage } from './sentry-acceptance-page.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { zIndexManager } from '../../utils/z-index-manager.ts';

export const Onboarding = () => {
  const { settings } = useSettingsStore();
  const steps = [
    settings.spoilerWarningAccepted,
    settings.sentry.initialPopupSeen,
  ];

  // using useRef as we don't want this number updated after the first render
  const onboardingStepsCount = useRef(
    steps.reduce((sum, current) => sum + Number(!current), 0),
  );
  // WARNING: this logic needs to be revisited when adding a third step

  const currentStep =
    Number(settings.spoilerWarningAccepted) +
    Number(settings.sentry.initialPopupSeen) +
    1;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backdropFilter: 'brightness(0.5) blur(20px)',
        zIndex: zIndexManager.onboardingPanel,
      }}
      // let google know not to index the onboarding popup
      data-nosnippet
    >
      <Flex width='100%' height='100%' center direction='column'>
        {onboardingStepsCount.current > 1 && (
          <div>
            Onboarding {currentStep} / {onboardingStepsCount.current}
          </div>
        )}
        {!settings.spoilerWarningAccepted && <SpoilerWarningPage />}
        {settings.spoilerWarningAccepted &&
          !settings.sentry.initialPopupSeen && <SentryAcceptancePage />}
      </Flex>
    </div>
  );
};
