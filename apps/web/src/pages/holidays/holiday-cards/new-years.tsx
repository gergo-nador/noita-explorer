import { Card } from '@noita-explorer/noita-component-library';
import { useContext } from 'react';
import { NoitaHolidayContext } from '../../../contexts/noita-holiday-context.ts';

export const NewYears = () => {
  const { fireFireworks } = useContext(NoitaHolidayContext);

  return (
    <div onClick={() => fireFireworks(1)}>
      <Card
        styling={{
          borderDark: 'gold',
          borderBright: 'gold',
        }}
      >
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
            <div>
              <div style={{ marginBottom: 15 }}>
                <span className={'text-xl'}>New Years</span>
                <span className={'text-secondary text-xl'}>
                  {' '}
                  - 30 December – 2 January
                </span>
              </div>
              <div>
                Powerful Firework launching boxes, Pata, will rarely spawn at
                the Forest start location. It has a 12.5% chance to appear.
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
