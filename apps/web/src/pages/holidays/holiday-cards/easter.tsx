import { Card, Icon } from '@noita-explorer/noita-component-library';

import egg1 from '../../../assets/holidays/egg.png';
import egg2 from '../../../assets/holidays/hollow_egg.png';

export const Easter = () => {
  // https://www.irt.org/articles/js052/index.htm
  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <Icon
            style={{
              position: 'absolute',
              transform: 'translateY(-50%) translateX(-50%) rotateZ(-15deg)',
            }}
            src={egg1}
            size={50}
          />
          <Icon
            style={{
              position: 'absolute',
              transform: 'translateY(100%) translateX(-50%) rotateZ(-15deg)',
            }}
            src={egg2}
            size={50}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        >
          <Icon
            style={{
              position: 'absolute',
              transform: 'translateY(100%) translateX(-50%) rotateZ(15deg)',
            }}
            src={egg1}
            size={50}
          />
          <Icon
            style={{
              position: 'absolute',
              transform: 'translateY(-50%) translateX(-50%) rotateZ(15deg)',
            }}
            src={egg2}
            size={50}
          />
        </div>
      </div>
      <Card
        styling={{
          borderDark: '#f9ceee',
          borderBright: '#c1f0fb',
        }}
      >
        <div style={{ marginBottom: 15 }}>
          <span className={'text-xl'}>Easter</span>
          <span className={'text-secondary text-xl'}>
            {' '}
            - 7 days before Easter
          </span>
        </div>
        <div>Mämmi Potion Mämmi will replace 10.9% of potions.</div>
      </Card>
    </div>
  );
};
