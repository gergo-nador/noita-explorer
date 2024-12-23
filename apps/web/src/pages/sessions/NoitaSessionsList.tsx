import { NoitaSession, StringKeyDictionary } from '@noita-explorer/model';
import { mapDictionary, secondsToTimeString } from '@noita-explorer/tools';
import {
  Button,
  Card,
  Header,
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { Flex } from '../../components/Flex.tsx';
import { useMemo, useState } from 'react';

import dieIcon from '../../assets/icons/die2.png';
import lifetimeIcon from '../../assets/icons/spells/lifetime.webp';
import moneyIcon from '../../assets/icons/money.png';
import deathIcon from '../../assets/icons/icon_danger.png';

interface NoitaSessionsListProps {
  sessionsGrouped: StringKeyDictionary<NoitaSession[]>;
}

export const NoitaSessionsList = ({
  sessionsGrouped,
}: NoitaSessionsListProps) => {
  const items = useMemo(
    () =>
      mapDictionary(sessionsGrouped, (key, val) => ({
        key: key,
        val: val,
      })),
    [sessionsGrouped],
  );

  const initialItemCount = 10;
  const increaseItemCountBy = 10;

  const [loadedSessionsCount, setLoadedSessionsCount] =
    useState(initialItemCount);

  const loadNext = () => {
    const nextLoadedSessionsCount = Math.min(
      loadedSessionsCount + increaseItemCountBy,
      items.length,
    );

    setLoadedSessionsCount(nextLoadedSessionsCount);
  };

  const loadedItems = useMemo(() => {
    const end = Math.min(loadedSessionsCount, items.length);
    return items.slice(0, end);
  }, [loadedSessionsCount, items]);

  const hasMoreItems = loadedItems.length < items.length;

  return (
    <Flex gap={20} style={{ flexDirection: 'column' }}>
      {loadedItems.map((item) => (
        <Header title={item.key} key={item.key}>
          <Flex
            gap={20}
            style={{
              flexDirection: 'column',
            }}
          >
            {item.val.map((session) => (
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

                    <div>
                      {!session.dead && <div>Not dead</div>}
                      {session.dead && (
                        <div>
                          <Icon type={'custom'} src={deathIcon} size={20} />
                          {session.killedByEntity === undefined &&
                            session.killedByReason === undefined && (
                              <span>New Game</span>
                            )}
                          {!!session.killedByEntity && (
                            <span>{session.killedByEntity}: </span>
                          )}
                          {!!session.killedByReason && (
                            <span>{session.killedByReason}</span>
                          )}
                        </div>
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

      {hasMoreItems && (
        <div>
          <Button onClick={loadNext}>Load More</Button>
        </div>
      )}
      {!hasMoreItems && <div>This is the end</div>}
    </Flex>
  );
};
