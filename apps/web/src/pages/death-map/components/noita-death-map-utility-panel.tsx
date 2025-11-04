import { NoitaSession } from '@noita-explorer/model-noita';
import { useMemo, useState } from 'react';
import { Button } from '@noita-explorer/noita-component-library';
import { dictionaryHelpers } from '@noita-explorer/tools';
import { sortHelpers } from '@noita-explorer/tools';
import { StringKeyDictionary } from '@noita-explorer/model';
import css from './noita-death-map-utility-panel.module.css';

interface Props {
  sessionsFiltered: NoitaSession[];
  uniqueKilledByReasons: string[];
  colorMap: StringKeyDictionary<string>;
}

export const NoitaDeathMapUtilityPanel = ({
  sessionsFiltered,
  uniqueKilledByReasons,
  colorMap,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const stats = useMemo(() => {
    const stats: Record<string, { killedBy: number }> = {};

    for (const session of sessionsFiltered) {
      const killedByReason = session.killedByReason;
      if (!killedByReason) continue;

      if (!(killedByReason in stats)) {
        stats[killedByReason] = { killedBy: 0 };
      }

      stats[killedByReason].killedBy += 1;
    }

    return dictionaryHelpers
      .mapDictionary(stats, (key, value) => ({
        killedByReason: key,
        count: value.killedBy,
      }))
      .sort(sortHelpers.getPropertySorter('count', 'desc'));
  }, [uniqueKilledByReasons, sessionsFiltered]);

  return (
    <div className={css['panel']}>
      {isOpen ? (
        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto auto auto',
              columnGap: '10px',
            }}
          >
            {stats.map((stat) => (
              <>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: colorMap[stat.killedByReason],
                  }}
                ></div>
                <div>{stat.killedByReason}</div>
                <div>{stat.count}</div>
              </>
            ))}
          </div>
          <br />
          <Button onClick={() => setIsOpen(false)}>Close Stats</Button>
        </div>
      ) : (
        <div>
          <Button onClick={() => setIsOpen(true)}>Open Stats</Button>
        </div>
      )}
    </div>
  );
};
