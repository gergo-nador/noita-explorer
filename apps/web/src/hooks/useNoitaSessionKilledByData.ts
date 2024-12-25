import { useMemo } from 'react';
import { arrayHelpers } from '@noita-explorer/tools';
import { NoitaSession, StringKeyDictionary } from '@noita-explorer/model';

export const useNoitaSessionKilledByData = (sessions: NoitaSession[]) => {
  const [killedByEntity, killedByReason] = useMemo(() => {
    const killedByEntity = arrayHelpers.unique(
      sessions
        .map((s) => s.killedByEntity)
        .filter((entity) => entity !== undefined),
    );
    const killedByReason = arrayHelpers.unique(
      sessions
        .map((s) => s.killedByReason)
        .filter((reason) => reason !== undefined),
    );

    killedByEntity.sort((a, b) => a.localeCompare(b));
    killedByReason.sort((a, b) => a.localeCompare(b));

    return [killedByEntity, killedByReason];
  }, [sessions]);

  const [killedByEntityMap, killedByReasonMap] = useMemo(() => {
    const killedByEntityArr = killedByEntity.map((entity) => {
      const sessionsKilledByEntity = sessions.filter(
        (s) => s.killedByEntity === entity,
      );
      const relatedReasons = arrayHelpers.unique(
        sessionsKilledByEntity
          .map((s) => s.killedByReason)
          .filter((r) => r !== undefined),
      );

      return {
        key: entity,
        value: sessionsKilledByEntity.length,
        relatedReasons: relatedReasons,
      };
    });

    const killedByEntityMap: StringKeyDictionary<{
      value: number;
      relatedReasons: string[];
    }> = arrayHelpers.asDict(killedByEntityArr, (item) => item.key);

    const killedByReasonArr = killedByReason.map((reason) => {
      const sessionsKilledByReason = sessions.filter(
        (s) => s.killedByReason === reason,
      );
      const relatedEntities = arrayHelpers.unique(
        sessionsKilledByReason
          .map((s) => s.killedByEntity)
          .filter((e) => e !== undefined),
      );

      return {
        key: reason,
        value: sessionsKilledByReason.length,
        relatedEntities: relatedEntities,
      };
    });

    const killedByReasonMap: StringKeyDictionary<{
      value: number;
      relatedEntities: string[];
    }> = arrayHelpers.asDict(killedByReasonArr, (item) => item.key);

    return [killedByEntityMap, killedByReasonMap];
  }, [sessions, killedByEntity, killedByReason]);

  return {
    killedByEntity,
    killedByReason,
    killedByEntityMap,
    killedByReasonMap,
  };
};
