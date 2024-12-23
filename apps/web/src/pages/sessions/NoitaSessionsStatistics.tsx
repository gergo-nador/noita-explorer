import {
  avgBy,
  maxBy,
  minBy,
  round,
  secondsToTimeString,
  sumBy,
} from '@noita-explorer/tools';
import { NoitaSession } from '@noita-explorer/model';

interface NoitaSessionsStatisticsProps {
  sessionsGroupedByDay: NoitaSession[][];
  sessions: NoitaSession[];
}

export const NoitaSessionsStatistics = ({
  sessions,
  sessionsGroupedByDay,
}: NoitaSessionsStatisticsProps) => {
  const statsMostPlayedOneDay = maxBy(
    sessionsGroupedByDay,
    (arr) => arr.length,
  ).value;

  const statsAvgPlayPerDay = avgBy(sessionsGroupedByDay, (arr) => arr.length);

  const sumPlaytime = sumBy(sessions, (s) => s.playTime);

  const statsFirstDayPlayed = minBy(sessions, (s) => s.startedAt.getTime()).item
    ?.startedAt;

  return (
    <div>
      Statistics
      <ul>
        <li>
          First day played (time since then):{' '}
          {statsFirstDayPlayed?.toLocaleDateString()}
        </li>
        <li>Most played on one day: {statsMostPlayedOneDay}</li>
        <li>average game per game day: {round(statsAvgPlayPerDay ?? 0, 2)}</li>
        <li>Sum Playtime: {secondsToTimeString(sumPlaytime)}</li>
      </ul>
    </div>
  );
};
