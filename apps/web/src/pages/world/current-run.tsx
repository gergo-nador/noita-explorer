import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import { Icon } from '@noita-explorer/noita-component-library';
import { CurrentRunPerksView } from './current-run-perks-view.tsx';
import { Flex } from '../../components/flex.tsx';

export const CurrentRun = () => {
  const { data } = useNoitaDataWakStore();

  if (!data) {
    return <div>Data wak is still loading...</div>;
  }

  return (
    <div>
      <div>
        <div
          style={{ display: 'grid', gridTemplateColumns: '300px 20px 50px' }}
        >
          <div>
            <ProgressBar progress={60} barColor={progressBarColors.healthBar} />
            <ProgressBar progress={60} barColor={progressBarColors.healthBar} />
          </div>
          <div>
            <Icon type={'custom'} alt={'Health'} />
          </div>
          <div>Health</div>
        </div>
        <CurrentRunPerksView />
      </div>
    </div>
  );
};

const progressBarColors = {
  healthBar: '#87BF1C',
  flyingBar: '#FFAA40',
  manaBar: '#42A8E2',
};

const ProgressBar = ({
  progress,
  barColor,
  width = '100%',
  height = '20px',
}: {
  progress: number;
  barColor: string;
  width?: string | number;
  height?: string | number;
}) => {
  const lightBrown = '#572727';
  const brown = '#4c2222';
  const darkBrown = '#3a1919';

  progress ??= 0;
  progress = Math.min(progress, 100);
  progress = Math.max(progress, 0);

  const progressBgWidth = 100 - progress;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '4px 1fr 4px',
        gridTemplateRows: '4px 1fr 4px',
        width: width,
        height: height,
      }}
    >
      <div style={{ background: lightBrown }}></div>
      <div style={{ background: brown }}></div>
      <div style={{ background: lightBrown }}></div>
      <div style={{ background: brown }}></div>
      <Flex>
        <div style={{ background: barColor, width: progress + '%' }}></div>
        <div
          style={{ background: darkBrown, width: progressBgWidth + '%' }}
        ></div>
      </Flex>
      <div style={{ background: brown }}></div>
      <div style={{ background: lightBrown }}></div>
      <div style={{ background: brown }}></div>
      <div style={{ background: lightBrown }}></div>
    </div>
  );
};
