import { useSettingsStore } from '../stores/settings.ts';
import { mathHelpers, switchStatement } from '@noita-explorer/tools';
import { NoitaConstants } from '@noita-explorer/model';

export const useNoitaUnits = () => {
  const { units } = useSettingsStore();

  return {
    degree: (degree: number) => `${degree} DEG`,
    frames: (frames: number) =>
      switchStatement(units.time).cases({
        frames: `${frames} f`,
        seconds: `${mathHelpers.round(frames / NoitaConstants.framesPerSecond, 2)} s`,
      }) as string,
    framesWithoutUnit: (frames: number) =>
      switchStatement(units.time).cases({
        frames: `${frames}`,
        seconds: `${mathHelpers.round(frames / NoitaConstants.framesPerSecond, 2)}`,
      }) as string,
  };
};
