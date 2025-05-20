import { useSettingsStore } from '../stores/settings.ts';
import { mathHelpers, switchStatement } from '@noita-explorer/tools';
import { NoitaConstants } from '@noita-explorer/model-noita';

type FrameDefaultFormats = 'frames' | 'seconds';

export const useNoitaUnits = () => {
  const { settings } = useSettingsStore();
  const { units } = settings;

  const formatFrames = (
    frames: number,
    defaultFormat: FrameDefaultFormats,
    includeUnits: boolean,
  ) => {
    const format = units.time === 'default' ? defaultFormat : units.time;

    const value = switchStatement(format).cases({
      frames: `${frames}`,
      seconds: `${mathHelpers.round(frames / NoitaConstants.framesPerSecond, 2)}`,
    }) as string;

    if (!includeUnits) {
      return value;
    }

    if (format === 'frames') {
      return value + ' f';
    }
    return value + ' s';
  };

  return {
    degree: (degree: number) => `${degree} DEG`,
    frames: (frames: number, defaultFormat: FrameDefaultFormats) =>
      formatFrames(frames, defaultFormat, true),
    framesWithoutUnit: (frames: number, defaultFormat: FrameDefaultFormats) =>
      formatFrames(frames, defaultFormat, false),
    frameDefaultUnits: {
      fireRateWait: 'seconds' as FrameDefaultFormats,
      reloadTime: 'seconds' as FrameDefaultFormats,
      lifetime: 'frames' as FrameDefaultFormats,
      gameEffectTime: 'frames' as FrameDefaultFormats,
      wandRechargeTime: 'seconds' as FrameDefaultFormats,
    },
  };
};
