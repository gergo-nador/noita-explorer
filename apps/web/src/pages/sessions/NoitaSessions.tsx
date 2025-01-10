import { useSave00Store } from '../../stores/save00.ts';
import { useMemo, useState } from 'react';
import { arrayHelpers } from '@noita-explorer/tools';
import { CardPageHeight } from '../../components/CardPageHeight.tsx';
import { NoitaSessionsFilter } from './NoitaSessionsFilter.tsx';
import { NoitaSessionsList } from './NoitaSessionsList.tsx';
import { NoitaSessionsStatistics } from './NoitaSessionsStatistics.tsx';
import { NoitaSession } from '@noita-explorer/model-noita';

export interface NoitaSessionFilters {
  goldInfinite: boolean;
  builds: string[];
  killedByReasons: string[];
  killedByEntity: string[];
}

export type NoitaSessionOrderingType = undefined | 'asc' | 'desc';
export interface NoitaSessionOrdering {
  gold?: NoitaSessionOrderingType;
  goldAll?: NoitaSessionOrderingType;
  playedAt?: NoitaSessionOrderingType;
  playTime?: NoitaSessionOrderingType;
  enemiesKilled?: NoitaSessionOrderingType;
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
  const [noitaSessionOrdering, _setNoitaSessionOrdering] =
    useState<NoitaSessionOrdering>({
      gold: undefined,
      goldAll: undefined,
      playedAt: 'desc',
      playTime: undefined,
    });

  const setNoitaSessionOrdering = (val: NoitaSessionOrdering) => {
    _setNoitaSessionOrdering({
      ...val,
    });
  };

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

  const sessionsGrouped = useMemo(() => {
    if (sessionsFiltered === undefined) {
      return undefined;
    }

    const temp = [...sessionsFiltered];

    if (noitaSessionOrdering.playTime !== undefined) {
      if (noitaSessionOrdering.playTime === 'asc') {
        temp.sort((s1, s2) => s1.playTime - s2.playTime);
      } else {
        temp.sort((s1, s2) => s2.playTime - s1.playTime);
      }

      return arrayHelpers.groupBy(
        temp,
        () => 'Play Time: ' + noitaSessionOrdering.playTime,
      );
    }

    if (noitaSessionOrdering.goldAll !== undefined) {
      if (noitaSessionOrdering.goldAll === 'asc') {
        temp.sort((s1, s2) => s1.goldAll - s2.goldAll);
      } else {
        temp.sort((s1, s2) => s2.goldAll - s1.goldAll);
      }

      return arrayHelpers.groupBy(
        temp,
        () => 'Gold all: ' + noitaSessionOrdering.goldAll,
      );
    }

    if (noitaSessionOrdering.gold !== undefined) {
      if (noitaSessionOrdering.gold === 'asc') {
        temp.sort((s1, s2) => s1.gold - s2.gold);
      } else {
        temp.sort((s1, s2) => s2.gold - s1.gold);
      }

      return arrayHelpers.groupBy(
        temp,
        () => 'Gold: ' + noitaSessionOrdering.gold,
      );
    }

    if (noitaSessionOrdering.enemiesKilled !== undefined) {
      if (noitaSessionOrdering.enemiesKilled === 'asc') {
        temp.sort((s1, s2) => s1.enemiesKilled - s2.enemiesKilled);
      } else {
        temp.sort((s1, s2) => s2.enemiesKilled - s1.enemiesKilled);
      }

      return arrayHelpers.groupBy(
        temp,
        () => 'Enemies killed: ' + noitaSessionOrdering.enemiesKilled,
      );
    }

    if (noitaSessionOrdering.playedAt === 'desc') {
      temp.reverse();
    }

    return arrayHelpers.groupBy(temp, (session) =>
      session.startedAt.toLocaleDateString(),
    );
  }, [sessionsFiltered, noitaSessionOrdering]);

  if (sessions === undefined || sessionsGrouped === undefined) {
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
          ordering={noitaSessionOrdering}
          setOrdering={setNoitaSessionOrdering}
        />
      </CardPageHeight>

      <CardPageHeight>
        <NoitaSessionsList sessionsGrouped={sessionsGrouped.asDict()} />
      </CardPageHeight>

      <CardPageHeight>
        <NoitaSessionsStatistics sessions={sessions} />
      </CardPageHeight>
    </div>
  );
};
