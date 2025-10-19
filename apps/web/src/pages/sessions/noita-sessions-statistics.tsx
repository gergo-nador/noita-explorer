import { timeHelpers, arrayHelpers, mathHelpers } from '@noita-explorer/tools';
import { NoitaSession } from '@noita-explorer/model-noita';
import { useMemo } from 'react';
import { SpaceCharacter } from '../../components/space-character.tsx';

interface NoitaSessionsStatisticsProps {
  sessions: NoitaSession[];
}

export const NoitaSessionsStatistics = ({
  sessions,
}: NoitaSessionsStatisticsProps) => {
  const sessionsGroupedByDay = useMemo(() => {
    return arrayHelpers
      .groupBy(sessions, (session) => session.startedAt.toLocaleDateString())
      .asArray();
  }, [sessions]);

  const statsMostPlayedOneDay = arrayHelpers.maxBy(
    sessionsGroupedByDay,
    (arr: NoitaSession[]) => arr.length,
  ).value;

  const statsAvgPlayPerDay = arrayHelpers.avgBy(
    sessionsGroupedByDay,
    (arr: NoitaSession[]) => arr.length,
  );

  const sumPlaytime = arrayHelpers.sumBy(sessions, (s) => s.playTime);

  const statsFirstDayPlayed = arrayHelpers.minBy(sessions, (s) =>
    s.startedAt.getTime(),
  ).item?.startedAt;

  return (
    <div>
      Statistics
      <ul>
        <li>
          First day played (time since then):
          <SpaceCharacter />
          {statsFirstDayPlayed?.toLocaleDateString()}
        </li>
        <li>Most played on one day: {statsMostPlayedOneDay}</li>
        <li>
          average game per game day:
          <SpaceCharacter />
          {mathHelpers.round(statsAvgPlayPerDay ?? 0, 2)}
        </li>
        <li>Sum Playtime: {timeHelpers.secondsToTimeString(sumPlaytime)}</li>
      </ul>
    </div>
  );
};
