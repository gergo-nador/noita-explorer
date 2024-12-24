import { timeHelpers, arrayHelpers, mathHelpers } from '@noita-explorer/tools';
import { NoitaSession } from '@noita-explorer/model';

interface NoitaSessionsStatisticsProps {
  sessionsGroupedByDay: NoitaSession[][];
  sessions: NoitaSession[];
}

export const NoitaSessionsStatistics = ({
  sessions,
  sessionsGroupedByDay,
}: NoitaSessionsStatisticsProps) => {
  const statsMostPlayedOneDay = arrayHelpers.maxBy(
    sessionsGroupedByDay,
    (arr) => arr.length,
  ).value;

  const statsAvgPlayPerDay = arrayHelpers.avgBy(
    sessionsGroupedByDay,
    (arr) => arr.length,
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
          First day played (time since then):{' '}
          {statsFirstDayPlayed?.toLocaleDateString()}
        </li>
        <li>Most played on one day: {statsMostPlayedOneDay}</li>
        <li>
          average game per game day:{' '}
          {mathHelpers.round(statsAvgPlayPerDay ?? 0, 2)}
        </li>
        <li>Sum Playtime: {timeHelpers.secondsToTimeString(sumPlaytime)}</li>
      </ul>
    </div>
  );
};
