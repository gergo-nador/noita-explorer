import { Button, Header } from '@noita-explorer/noita-component-library';
import { NoitaSession } from '@noita-explorer/model';
import { NoitaSessionFilters } from './NoitaSessions.tsx';
import { arrayHelpers } from '@noita-explorer/tools';
import { useNoitaSessionKilledByData } from '../../hooks/useNoitaSessionKilledByData.ts';
import { useState } from 'react';

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
  const {
    killedByReason,
    killedByReasonMap,
    killedByEntityMap,
    killedByEntity,
  } = useNoitaSessionKilledByData(sessions);
  const [killedByEntityHover, setKilledByEntityHover] = useState<string>();
  const [killedByReasonHover, setKilledByReasonHover] = useState<string>();

  const noitaBuilds = arrayHelpers.unique(sessions.map((s) => s.buildName));

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
                    builds: arrayHelpers.toggleItemInList(filters.builds, b),
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
            <div style={{ position: 'sticky', top: 0 }}>
              {killedByEntity.map((entity) => (
                <Button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      killedByEntity: arrayHelpers.toggleItemInList(
                        filters.killedByEntity,
                        entity,
                      ),
                    })
                  }
                  textStyle={{
                    ...activeTextFilterDecoration(
                      filters.killedByEntity.includes(entity),
                    ),
                    opacity:
                      !killedByReasonHover ||
                      (killedByReasonHover in killedByReasonMap &&
                        killedByReasonMap[
                          killedByReasonHover
                        ].relatedEntities.includes(entity))
                        ? 1
                        : 0.6,
                  }}
                  onMouseEnter={() => setKilledByEntityHover(entity)}
                  onFocus={() => setKilledByEntityHover(entity)}
                  onMouseLeave={() => setKilledByEntityHover(undefined)}
                  onBlur={() => setKilledByEntityHover(undefined)}
                >
                  {entity === '' ? 'None' : entity} (
                  {killedByEntityMap[entity]?.value})
                </Button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ position: 'sticky', top: 0 }}>
              {killedByReason.map((reason) => (
                <Button
                  onClick={() =>
                    setFilters({
                      ...filters,
                      killedByReasons: arrayHelpers.toggleItemInList(
                        filters.killedByReasons,
                        reason,
                      ),
                    })
                  }
                  textStyle={{
                    ...activeTextFilterDecoration(
                      filters.killedByReasons.includes(reason),
                    ),
                    opacity:
                      !killedByEntityHover ||
                      (killedByEntityHover in killedByEntityMap &&
                        killedByEntityMap[
                          killedByEntityHover
                        ].relatedReasons.includes(reason))
                        ? 1
                        : 0.6,
                  }}
                  onMouseEnter={() => setKilledByReasonHover(reason)}
                  onFocus={() => setKilledByReasonHover(reason)}
                  onMouseLeave={() => setKilledByReasonHover(undefined)}
                  onBlur={() => setKilledByReasonHover(undefined)}
                >
                  {reason} ({killedByReasonMap[reason]?.value})
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Header>
    </div>
  );
};
