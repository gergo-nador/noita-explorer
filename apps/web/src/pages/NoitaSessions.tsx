import { useSave00Store } from '../stores/save00.ts';
import { useMemo } from 'react';
import {
  Card,
  Header,
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { Flex } from '../components/Flex.tsx';
import {
  avgBy,
  groupBy,
  mapDictionary,
  maxBy,
  minBy,
  secondsToTimeString,
  sumBy,
} from '@noita-explorer/tools';
import { round } from '@noita-explorer/tools';

import lifetimeIcon from '../assets/icons/spells/lifetime.webp';
import dieIcon from '../assets/icons/die2.png';
import moneyIcon from '../assets/icons/money.png';

export const NoitaSessions = () => {
  const { sessions } = useSave00Store();

  const sessionsSorted = useMemo(() => {
    if (sessions === undefined) {
      return undefined;
    }

    const temp = [...sessions];
    temp.reverse();

    return temp;
  }, [sessions]);

  const sessionsGroupedByDay = useMemo(() => {
    if (sessionsSorted === undefined) {
      return undefined;
    }

    return groupBy(sessionsSorted, (session) =>
      session.startedAt.toLocaleDateString(),
    );
  }, [sessionsSorted]);

  if (sessions === undefined || sessionsGroupedByDay === undefined) {
    return <div>Sessions are not loaded</div>;
  }

  const statsMostPlayedOneDay = maxBy(
    sessionsGroupedByDay.asArray(),
    (arr) => arr.length,
  ).value;

  const statsAvgPlayPerDay = avgBy(
    sessionsGroupedByDay.asArray(),
    (arr) => arr.length,
  );

  const sumPlaytime = sumBy(sessions, (s) => s.playTime);

  const statsFirstDayPlayed = minBy(sessions, (s) => s.startedAt.getTime()).item
    ?.startedAt;

  return (
    <Flex
      gap={20}
      style={{
        flexDirection: 'column',
      }}
    >
      <div>TODO: </div>
      <div>
        Sort by (ascending, descending):
        <ul>
          <li>play time</li>
          <li>played at</li>
          <li>kills</li>
          <li>gold/gold all</li>
        </ul>
      </div>
      <div>
        Filter by
        <ul>
          <li>killed by</li>
          <li>gold infinite</li>
          <li>noita build</li>
        </ul>
      </div>
      <div>
        Statistics
        <ul>
          <li>
            First day played (time since then):{' '}
            {statsFirstDayPlayed?.toLocaleDateString()}
          </li>
          <li>Most played on one day: {statsMostPlayedOneDay}</li>
          <li>
            average game per game day: {round(statsAvgPlayPerDay ?? 0, 2)}
          </li>
          <li>Sum Playtime: {secondsToTimeString(sumPlaytime)}</li>
        </ul>
      </div>
      <br />
      <br />
      {mapDictionary(sessionsGroupedByDay.asDict(), (key, sessions) => (
        <Header title={key} key={key}>
          <Flex
            gap={20}
            style={{
              flexDirection: 'column',
            }}
          >
            {sessions.map((session) => (
              <Card key={session.id}>
                <div
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}
                >
                  <div>
                    <div>
                      <Icon type={'custom'} src={dieIcon} size={18} />{' '}
                      {session.seed}
                    </div>
                    <div>
                      <Icon type={'custom'} src={lifetimeIcon} size={20} />
                      {secondsToTimeString(session.playTime)}
                    </div>
                    <div>
                      <Icon type={'custom'} src={moneyIcon} size={20} />
                      {session.goldInfinite && <span>∞</span>}
                      {!session.goldInfinite && (
                        <NoitaTooltipWrapper
                          content={
                            <div style={{ fontSize: 18 }}>gold / all gold</div>
                          }
                        >
                          <span>
                            {session.gold} / {session.goldAll}
                          </span>
                        </NoitaTooltipWrapper>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div>
                      <span className={'text-secondary'}>Started at</span>{' '}
                      <span>{session.startedAt.toLocaleTimeString()}</span>
                    </div>
                    <div className={'text-secondary'}>{session.buildName}</div>
                  </div>
                </div>
              </Card>
            ))}
          </Flex>
        </Header>
      ))}
    </Flex>
  );
};
