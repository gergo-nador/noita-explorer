import { arrayHelpers } from '@noita-explorer/tools';
import { useSave00Service } from '../../services/save00/use-save00-service.ts';
import { useMemo } from 'react';

export const useDeathPositions = () => {
  const { sessions } = useSave00Service();

  const sessionsFiltered = useMemo(
    () =>
      sessions
        .map((s) =>
          s.killedByReason === undefined
            ? { ...s, killedByReason: 'New Game' }
            : s,
        )
        .filter((s) => s.deathPosX !== undefined),
    [sessions],
  );

  const uniqueProperties: string[] = useMemo(
    () =>
      arrayHelpers.unique(
        sessionsFiltered
          .map((s) => s.killedByReason)
          .filter((s) => s !== undefined),
      ),
    [sessionsFiltered],
  );

  return { sessionsFiltered, uniqueProperties };
};
