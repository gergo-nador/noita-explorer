import { useSettingsStore } from '../stores/settings.ts';

export const useOnboarding = () => {
  const { settings } = useSettingsStore();

  const isOnboardingDone =
    settings.spoilerWarningAccepted && settings.sentry.initialPopupSeen;

  return {
    isOnboardingDone,
  };
};
