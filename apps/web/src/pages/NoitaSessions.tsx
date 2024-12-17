import { useSave00Store } from '../stores/save00.ts';
import { useMemo } from 'react';
import { Card } from '@noita-explorer/noita-component-library';
import { Flex } from '../components/Flex.tsx';

export const NoitaSessions = () => {
  const { sessions } = useSave00Store();

  const sessionsSorted = useMemo(() => {
    if (sessions === undefined) {
      return [];
    }

    const temp = [...sessions];
    temp.reverse();

    return temp;
  }, [sessions]);

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
      <br />
      <br />
      {sessionsSorted.map((session) => (
        <Card>
          <div>{session.id}</div>
          <div>{session.buildName}</div>
          <div>{session.seed}</div>
          <div>{session.playTime}</div>
        </Card>
      ))}
    </Flex>
  );
};
