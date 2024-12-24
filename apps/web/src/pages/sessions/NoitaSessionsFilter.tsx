import {
  Button,
  DialogCustom,
  Header,
} from '@noita-explorer/noita-component-library';
import { NoitaSession } from '@noita-explorer/model';
import { NoitaSessionFilters } from './NoitaSessions.tsx';
import { NoitaSessionsFilterAdvanced } from './NoitaSessionsFilterAdvanced.tsx';
import { arrayHelpers } from '@noita-explorer/tools/common';
import { useState } from 'react';

interface NoitaSessionsFilterProps {
  sessions: NoitaSession[];
  filters: NoitaSessionFilters;
  setFilters: (filters: NoitaSessionFilters) => void;
}

export const NoitaSessionsFilter = ({
  sessions,
  filters,
  setFilters,
}: NoitaSessionsFilterProps) => {
  const noitaBuilds = [...new Set(sessions.map((s) => s.buildName))];
  const [showAdvancedDialog, setShowAdvancedDialog] = useState(false);

  const activeTextFilterDecoration = (isActive: boolean) =>
    isActive ? { textDecoration: 'underline', color: 'gold' } : {};

  return (
    <div>
      <Header title={'Sort by'}>
        <ul>
          <li>play time</li>
          <li>played at</li>
          <li>kills</li>
          <li>gold/gold all</li>
        </ul>
      </Header>
      <Header title={'Filter by'}>
        <div>
          <Button
            onClick={() => setShowAdvancedDialog((prevState) => !prevState)}
          >
            Advanced Filters
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
