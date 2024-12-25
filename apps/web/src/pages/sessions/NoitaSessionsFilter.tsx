import {
  Button,
  DialogCustom,
  Header,
} from '@noita-explorer/noita-component-library';
import { NoitaSession } from '@noita-explorer/model';
import {
  NoitaSessionFilters,
  NoitaSessionOrdering,
  NoitaSessionOrderingType,
} from './NoitaSessions.tsx';
import { NoitaSessionsFilterAdvanced } from './NoitaSessionsFilterAdvanced.tsx';
import { arrayHelpers } from '@noita-explorer/tools';
import { useState } from 'react';

interface NoitaSessionsFilterProps {
  sessions: NoitaSession[];
  filters: NoitaSessionFilters;
  setFilters: (filters: NoitaSessionFilters) => void;
  ordering: NoitaSessionOrdering;
  setOrdering: (orders: NoitaSessionOrdering) => void;
}

export const NoitaSessionsFilter = ({
  sessions,
  filters,
  setFilters,
  ordering,
  setOrdering,
}: NoitaSessionsFilterProps) => {
  const noitaBuilds = [...new Set(sessions.map((s) => s.buildName))];
  const [showAdvancedDialog, setShowAdvancedDialog] = useState(false);

  const activeTextFilterDecoration = (isActive: boolean) =>
    isActive ? { textDecoration: 'underline', color: 'gold' } : {};

  const advancedFilterCount =
    filters.killedByEntity.length + filters.killedByReasons.length;

  return (
    <div>
      <Header title={'Sort by'}>
        <div>
          <SortItem
            title={'Played at'}
            fieldGetter={() => ordering.playedAt}
            fieldSetter={(type) =>
              setOrdering({
                playedAt: type,
              })
            }
          />
          <SortItem
            title={'Play time'}
            fieldGetter={() => ordering.playTime}
            fieldSetter={(type) =>
              setOrdering({
                playTime: type,
              })
            }
          />
          <SortItem
            title={'Gold'}
            fieldGetter={() => ordering.gold}
            fieldSetter={(type) =>
              setOrdering({
                gold: type,
              })
            }
          />
          <SortItem
            title={'Gold all'}
            fieldGetter={() => ordering.goldAll}
            fieldSetter={(type) =>
              setOrdering({
                goldAll: type,
              })
            }
          />
        </div>
      </Header>
      <Header title={'Filter by'}>
        <div>
          <Button
            onClick={() => setShowAdvancedDialog((prevState) => !prevState)}
          >
            Advanced Filters{' '}
            {advancedFilterCount > 0 ? `(${advancedFilterCount})` : ''}
          </Button>
        </div>
        <br />
        <div>
          <Button
            onClick={() =>
              setFilters({ ...filters, goldInfinite: !filters.goldInfinite })
            }
            textStyle={activeTextFilterDecoration(filters.goldInfinite)}
          >
            Gold Infinite
          </Button>
        </div>
        <br />
        <div>
          {noitaBuilds.map((b) => (
            <div>
              <Button
                onClick={() =>
                  setFilters({
                    ...filters,
                    builds: arrayHelpers.toggleItemInList(filters.builds, b),
                  })
                }
                textStyle={activeTextFilterDecoration(
                  filters.builds.includes(b),
                )}
              >
                {b.startsWith('Noita-Build-')
                  ? b.substring('Noita-Build-'.length)
                  : b}
              </Button>
            </div>
          ))}
        </div>
        <br />
      </Header>

      {showAdvancedDialog && (
        <DialogCustom
          isOpen={true}
          onCloseRequest={() => setShowAdvancedDialog(false)}
          props={{
            children: (
              <NoitaSessionsFilterAdvanced
                filters={filters}
                setFilters={setFilters}
                sessions={sessions}
              />
            ),
          }}
        />
      )}
    </div>
  );
};

const SortItem = ({
  fieldGetter,
  fieldSetter,
  title,
}: {
  title: string;
  fieldGetter: () => NoitaSessionOrderingType;
  fieldSetter: (type: NoitaSessionOrderingType) => void;
}) => {
  const value = fieldGetter();
  const halfLength = title.length / 2;
  const title1 = title.substring(0, halfLength);
  const title2 = title.substring(halfLength, title.length);

  return (
    <div style={{ display: 'flex' }}>
      <Button
        decoration={'none'}
        onClick={() => fieldSetter('asc')}
        textStyle={{
          color: value === 'asc' ? 'gold' : 'inherit',
        }}
      >
        ▲ {title1}
      </Button>
      <Button
        decoration={'none'}
        onClick={() => fieldSetter('desc')}
        textStyle={{
          color: value === 'desc' ? 'gold' : 'inherit',
        }}
      >
        {title2} ▼
      </Button>
    </div>
  );
};
