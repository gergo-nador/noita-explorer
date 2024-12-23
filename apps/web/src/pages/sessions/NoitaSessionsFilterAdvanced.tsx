import { Button, Header } from '@noita-explorer/noita-component-library';
import { NoitaSession, StringKeyDictionary } from '@noita-explorer/model';
import { NoitaSessionFilters } from './NoitaSessions.tsx';
import { asDict, toggleItemInList } from '@noita-explorer/tools';
import { useMemo } from 'react';

interface NoitaSessionsFilterAdvancedProps {
  sessions: NoitaSession[];
  filters: NoitaSessionFilters;
  setFilters: (filters: NoitaSessionFilters) => void;
}

export const NoitaSessionsFilterAdvanced = ({
  filters,
  setFilters,
  sessions,
}: NoitaSessionsFilterAdvancedProps) => {
  const [killedByEntity, killedByReason] = useMemo(() => {
    const killedByEntity = [
      ...new Set(
        sessions
          .map((s) => s.killedByEntity)
          .filter((entity) => entity !== undefined),
      ),
    ];
    const killedByReason = [
      ...new Set(
        sessions
          .map((s) => s.killedByReason)
          .filter((reason) => reason !== undefined),
      ),
    ];

    killedByEntity.sort((a, b) => a.localeCompare(b));
    killedByReason.sort((a, b) => a.localeCompare(b));

    return [killedByEntity, killedByReason];
  }, [sessions]);

  const [killedByEntityMap, killedByReasonMap] = useMemo(() => {
    const killedByEntityArr = killedByEntity.map((entity) => {
      const sessionsKilledByEntity = sessions.filter(
        (s) => s.killedByEntity === entity,
      );
      const relatedReasons = [
        ...new Set(
          sessionsKilledByEntity
            .map((s) => s.killedByReason)
            .filter((r) => r !== undefined),
        ),
      ];

      return {
        key: entity,
        value: sessionsKilledByEntity.length,
        relatedReasons: relatedReasons,
      };
    });

    const killedByEntityMap: StringKeyDictionary<{
      value: number;
      relatedReasons: string[];
    }> = asDict(killedByEntityArr, (item) => item.key);

    const killedByReasonArr = killedByReason.map((reason) => {
      const sessionsKilledByReason = sessions.filter(
        (s) => s.killedByReason === reason,
      );
      const relatedEntities = [
        ...new Set(
          sessionsKilledByReason
            .map((s) => s.killedByEntity)
            .filter((e) => e !== undefined),
        ),
      ];

      return {
        key: reason,
        value: sessionsKilledByReason.length,
        relatedEntities: relatedEntities,
      };
    });

    const killedByReasonMap: StringKeyDictionary<{
      value: number;
      relatedEntities: string[];
    }> = asDict(killedByReasonArr, (item) => item.key);

    return [killedByEntityMap, killedByReasonMap];
  }, [sessions, killedByEntity, killedByReason]);

  const noitaBuilds = [...new Set(sessions.map((s) => s.buildName))];

  const activeTextFilterDecoration = (isActive: boolean) =>
    isActive ? { textDecoration: 'underline', color: 'gold' } : {};

  return (
    <div>
      <Header title={'Gold'}>
        <div>
          <Button
            onClick={() =>
              setFilters({ ...filters, goldInfinite: !filters.goldInfinite })
            }
            textStyle={activeTextFilterDecoration(filters.goldInfinite)}
          >
            Gold Infinite
          </Button>
        </div>
      </Header>
      <br />
      <Header title={'Build'}>
        <div>
          {noitaBuilds.map((b) => (
            <div>
              <Button
                onClick={() =>
                  setFilters({
                    ...filters,
                    builds: toggleItemInList(filters.builds, b),
                  })
                }
                textStyle={activeTextFilterDecoration(
                  filters.builds.includes(b),
                )}
              >
                {b.startsWith('Noita-Build-')
                  ? b.substring('Noita-Build-'.length)
                  : b}
              </Button>
            </div>
          ))}
        </div>
      </Header>
      <br />
      <Header title={'Killed By'}>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: 10 }}
        >
          <div>
            {killedByEntity.map((entity) => (
              <Button
                onClick={() =>
                  setFilters({
                    ...filters,
                    killedByEntity: toggleItemInList(
                      filters.killedByEntity,
                      entity,
                    ),
                  })
                }
                textStyle={activeTextFilterDecoration(
                  filters.killedByEntity.includes(entity),
                )}
              >
                {entity === '' ? 'None' : entity} (
                {killedByEntityMap[entity]?.value})
              </Button>
            ))}
          </div>
          <div>
            {killedByReason.map((reason) => (
              <Button
                onClick={() =>
                  setFilters({
                    ...filters,
                    killedByReasons: toggleItemInList(
                      filters.killedByReasons,
                      reason,
                    ),
                  })
                }
                textStyle={activeTextFilterDecoration(
                  filters.killedByReasons.includes(reason),
                )}
              >
                {reason} ({killedByReasonMap[reason]?.value})
              </Button>
            ))}
          </div>
        </div>
      </Header>
    </div>
  );
};
