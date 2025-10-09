import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaSession } from '@noita-explorer/model-noita';
import { Card, Header } from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { useRef } from 'react';
import { HoveredStyle } from '@noita-explorer/react-utils';
import { useInfiniteScroll } from './use-infinite-scroll.ts';
import { useSessionPagination } from './use-session-pagination.ts';
import { NoitaSessionCard } from './noita-session-card.tsx';

interface NoitaSessionsListProps {
  sessionsGrouped: StringKeyDictionary<NoitaSession[]>;
}

export const NoitaSessionsList = ({
  sessionsGrouped,
}: NoitaSessionsListProps) => {
  const { hasMoreItems, loadedItems, loadNext } = useSessionPagination({
    sessionsGrouped,
  });

  const ref = useRef<HTMLDivElement>(null);
  useInfiniteScroll({ ref, bottomThreshold: 400, onBottomReached: loadNext });

  return (
    <Flex gap={20} ref={ref} style={{ flexDirection: 'column' }}>
      {loadedItems.map((item) => {
        const hasNoSession = item.val.length === 0;

        if (hasNoSession) {
          return <></>;
        }

        return (
          <Header title={item.key} key={item.key}>
            <Flex
              gap={20}
              style={{
                flexDirection: 'column',
              }}
            >
              {item.val.map((session) => (
                <NoitaSessionCard session={session} />
              ))}
            </Flex>
          </Header>
        );
      })}

      {hasMoreItems && (
        <div onClick={loadNext} style={{ cursor: 'pointer' }}>
          <HoveredStyle style={{ filter: 'brightness(1.2)' }}>
            <Card>
              <Flex center>
                <span style={{ color: 'inherit' }}>Load More</span>
              </Flex>
            </Card>
          </HoveredStyle>
        </div>
      )}
      {!hasMoreItems && <Flex center>This is the end</Flex>}
    </Flex>
  );
};
