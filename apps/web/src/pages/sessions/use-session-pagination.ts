import { useEffect, useMemo, useState } from 'react';
import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaSession } from '@noita-explorer/model-noita';
import { arrayHelpers, dictionaryHelpers } from '@noita-explorer/tools';

interface Props {
  sessionsGrouped: StringKeyDictionary<NoitaSession[]>;
}

export function useSessionPagination({ sessionsGrouped }: Props) {
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

  return { hasMoreItems, loadedItems, loadNext };
}
