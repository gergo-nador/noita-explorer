import { useSave00Store } from '../../stores/save00.ts';
import { useMemo, useState } from 'react';
import { groupBy } from '@noita-explorer/tools';
import { CardPageHeight } from '../../components/CardPageHeight.tsx';
import { NoitaSessionsFilter } from './NoitaSessionsFilter.tsx';
import { NoitaSessionsList } from './NoitaSessionsList.tsx';
import { NoitaSessionsStatistics } from './NoitaSessionsStatistics.tsx';
import { NoitaSession } from '@noita-explorer/model';

export interface NoitaSessionFilters {
  goldInfinite: boolean;
  builds: string[];
  killedByReasons: string[];
  killedByEntity: string[];
}

export const NoitaSessions = () => {
  const { sessions } = useSave00Store();
  const [noitaSessionFilters, setNoitaSessionFilters] =
    useState<NoitaSessionFilters>({
      goldInfinite: false,
      builds: [],
      killedByEntity: [],
      killedByReasons: [],
    });

  const sessionsFiltered = useMemo(() => {
    const filters: ((s: NoitaSession) => boolean)[] = [];

    if (noitaSessionFilters.goldInfinite) {
      filters.push((s) => s.goldInfinite);
    }

    if (noitaSessionFilters.builds.length > 0) {
      filters.push((s) => noitaSessionFilters.builds.includes(s.buildName));
    }

    if (noitaSessionFilters.killedByEntity.length > 0) {
      filters.push((s) => {
        if (s.killedByEntity === undefined) {
          return false;
        }

        return noitaSessionFilters.killedByEntity.includes(s.killedByEntity);
      });
    }

    if (noitaSessionFilters.killedByReasons.length > 0) {
      filters.push((s) => {
        if (s.killedByReason === undefined) {
          return false;
        }

        return noitaSessionFilters.killedByReasons.includes(s.killedByReason);
      });
    }

    return sessions?.filter((s) => filters.every((f) => f(s)));
  }, [sessions, noitaSessionFilters]);

  const sessionsSorted = useMemo(() => {
    if (sessionsFiltered === undefined) {
      return undefined;
    }

    const temp = [...sessionsFiltered];
    temp.reverse();

    return temp;
  }, [sessionsFiltered]);

  const sessionsGroupedByDay = useMemo(() => {
    if (sessionsSorted === undefined) {
      return undefined;
    }

    return groupBy(sessionsSorted, (session) =>
      session.startedAt.toLocaleDateString(),
    );
  }, [sessionsSorted]);

  if (sessions === undefined || sessionsGroupedByDay === undefined) {
    return (
      <CardPageHeight>
        <div>Sessions are not loaded</div>
      </CardPageHeight>
    );
  }

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '2fr 4fr 2fr ', gap: 15 }}
    >
      <CardPageHeight>
        <NoitaSessionsFilter
          sessions={sessions}
          filters={noitaSessionFilters}
          setFilters={setNoitaSessionFilters}
        />
      </CardPageHeight>

      <CardPageHeight>
        <NoitaSessionsList sessionsGrouped={sessionsGroupedByDay.asDict()} />
      </CardPageHeight>

      <CardPageHeight>
        <NoitaSessionsStatistics
          sessions={sessions}
          sessionsGroupedByDay={sessionsGroupedByDay.asArray()}
        />
      </CardPageHeight>
    </div>
  );
};
