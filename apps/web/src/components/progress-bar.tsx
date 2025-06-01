import { Flex } from './flex.tsx';

const progressBarColors: Record<string, string> = {
  healthBar: '#87BF1C',
  flyingBar: '#FFAA40',
  manaBar: '#42A8E2',
};

export const ProgressBar = ({
  progress,
  barColor,
  width = '100%',
  height = '20px',
}: {
  progress: number;
  barColor: string | 'healthBar' | 'flyingBar' | 'manaBar';
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

  barColor =
    barColor in progressBarColors ? progressBarColors[barColor] : barColor;

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
