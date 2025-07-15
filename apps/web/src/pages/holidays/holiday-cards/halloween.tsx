import { Card, Icon } from '@noita-explorer/noita-component-library';
import { randomHelpers } from '@noita-explorer/tools';
import { useMemo } from 'react';

export const Halloween = () => {
  const image = useMemo(() => {
    const images = [
      '/images/holidays/pumpkin_01.png',
      '/images/holidays/pumpkin_02.png',
      '/images/holidays/pumpkin_03.png',
      '/images/holidays/pumpkin_04.png',
      '/images/holidays/pumpkin_05.png',
    ];
    return randomHelpers.randomPick(images);
  }, []);

  return (
    <Card
      styling={{
        borderDark: '#ba4b20',
        borderBright: '#ba4b20',
      }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto' }}>
          <div>
            <div style={{ marginBottom: 15 }}>
              <span className='text-xl'>Halloween</span>
              <span className='text-secondary text-xl'> - 31 October</span>
            </div>
            <div>
              Pumpkins and carved Jack o' lantern pumpkins (including a 3-eyed
              variant) will spawn in parts of the overworld
            </div>
          </div>
          <div>
            <Icon src={image} alt='Pumpkin' width={70} />
          </div>
        </div>
      </div>
    </Card>
  );
};
