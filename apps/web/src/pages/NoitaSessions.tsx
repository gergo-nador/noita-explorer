import { useSave00Store } from '../stores/save00.ts';
import { useMemo } from 'react';
import { Card } from '@noita-explorer/noita-component-library';
import { Flex } from '../components/Flex.tsx';
import { groupBy, mapDictionary } from '@noita-explorer/tools';

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
    ).asDict();
  }, [sessionsSorted]);

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
          <li>First day played (time since then)</li>
          <li>most played on days</li>
          <li>average game per game day</li>
        </ul>
      </div>
      <br />
      <br />
      {sessionsGroupedByDay &&
        mapDictionary(sessionsGroupedByDay, (key, sessions) => (
          <div style={{ marginBottom: 20 }}>
            <div>{key}</div>
            <Flex
              gap={20}
              style={{
                flexDirection: 'column',
              }}
            >
              {sessions.map((session) => (
                <Card>
                  <div>{session.id}</div>
                  <div>{session.buildName}</div>
                  <div>{session.seed}</div>
                  <div>{session.playTime}</div>
                  <div>{session.startedAt.toLocaleTimeString()}</div>
                </Card>
              ))}
            </Flex>
          </div>
        ))}
    </Flex>
  );
};
