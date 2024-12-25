import { useSave00Store } from '../../stores/save00.ts';
import { useMemo, useState } from 'react';
import { arrayHelpers } from '@noita-explorer/tools';
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

type NoitaSessionOrderingType = undefined | 'asc' | 'desc';
export interface NoitaSessionOrdering {
  playTime?: NoitaSessionOrderingType;
}

const emptyOrdering: NoitaSessionOrdering = {
  playTime: undefined,
};

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
    useState<NoitaSessionOrdering>(emptyOrdering);

  const setNoitaSessionOrdering = (val: NoitaSessionOrdering) => {
    _setNoitaSessionOrdering({
      ...emptyOrdering,
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
      temp.sort((s1, s2) => s1.playTime - s2.playTime);
      if (noitaSessionOrdering.playTime === 'desc') {
        temp.reverse();
      }

      return arrayHelpers.groupBy(
        temp,
        () => 'Play Time: ' + noitaSessionOrdering.playTime,
      );
    }

    temp.reverse();

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
