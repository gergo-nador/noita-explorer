import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaSession } from '@noita-explorer/model-noita';
import {
  arrayHelpers,
  dictionaryHelpers,
  timeHelpers,
} from '@noita-explorer/tools';
import {
  Card,
  Header,
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { useEffect, useMemo, useState } from 'react';
import { HoveredStyle } from '@noita-explorer/react-utils';
import { publicPaths } from '../../utils/public-paths.ts';
import { SpaceCharacter } from '../../components/space-character.tsx';

interface NoitaSessionsListProps {
  sessionsGrouped: StringKeyDictionary<NoitaSession[]>;
}

export const NoitaSessionsList = ({
  sessionsGrouped,
}: NoitaSessionsListProps) => {
  const [items, itemsCount] = useMemo(() => {
    const items = dictionaryHelpers.mapDictionary(
      sessionsGrouped,
      (key, val) => ({
        key: key,
        val: val,
      }),
    );

    const count = arrayHelpers.sumBy(items, (item) => item.val.length);

    return [items, count];
  }, [sessionsGrouped]);

  const initialItemCount = 30;
  const increaseItemCountBy = 30;

  const [loadedSessionsCount, setLoadedSessionsCount] =
    useState(initialItemCount);

  useEffect(() => {
    setLoadedSessionsCount(initialItemCount);
  }, [items]);

  const loadNext = () => {
    const nextLoadedSessionsCount = Math.min(
      loadedSessionsCount + increaseItemCountBy,
      itemsCount,
    );

    setLoadedSessionsCount(nextLoadedSessionsCount);
  };

  const loadedItems = useMemo(() => {
    const end = Math.min(loadedSessionsCount, itemsCount);

    const loadedItems = [];
    let loadedItemsCount = 0;

    for (const item of items) {
      if (loadedItemsCount + item.val.length <= end) {
        loadedItems.push(item);
        loadedItemsCount += item.val.length;
        continue;
      }

      const newItemVal = item.val.slice(0, end - loadedItemsCount);
      loadedItems.push({
        key: item.key,
        val: newItemVal,
      });

      break;
    }

    return loadedItems;
  }, [loadedSessionsCount, items, itemsCount]);

  const hasMoreItems = loadedSessionsCount < itemsCount;

  return (
    <Flex gap={20} style={{ flexDirection: 'column' }}>
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
                <SessionCard session={session} />
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

const SessionCard = ({ session }: { session: NoitaSession }) => {
  return (
    <Card key={session.id}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <div>
            <Icon src={publicPaths.static.dataWak.icons('die2')} size={18} />
            <SpaceCharacter />
            {session.seed}
          </div>
          <div>
            <Icon src='images/data-wak/spells/lifetime.webp' size={20} />
            {timeHelpers.secondsToTimeString(session.playTime)}
          </div>
          <div>
            <Icon src={publicPaths.static.dataWak.icons('money')} size={20} />
            {session.goldInfinite && <span>∞</span>}
            {!session.goldInfinite && (
              <NoitaTooltipWrapper
                content={<div style={{ fontSize: 18 }}>gold / all gold</div>}
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
                <Icon
                  src={publicPaths.static.dataWak.icons('icon_danger')}
                  size={20}
                />
                {session.killedByEntity === undefined &&
                  session.killedByReason === undefined && <span>New Game</span>}
                {!!session.killedByEntity && (
                  <span>{session.killedByEntity}: </span>
                )}
                {!!session.killedByReason && (
                  <span>{session.killedByReason}</span>
                )}
              </div>
            )}
          </div>
          <div>
            <Icon src={publicPaths.static.dataWak.icons('enemy')} size={20} />
            {session.enemiesKilled}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>
            <span className={'text-secondary'}>
              {session.startedAt.toLocaleString()}
            </span>
          </div>
          <div className={'text-secondary'}>{session.buildName}</div>
        </div>
      </div>
    </Card>
  );
};
