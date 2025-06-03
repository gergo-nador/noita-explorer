import { useNoitaProgressTrackerPillarDefinitions } from './noita-progress-tracker-pillar-definitions.tsx';
import { enumerateHelpers } from '@noita-explorer/tools';
import { useSave00Store } from '../../../stores/save00.ts';
import { NoitaTooltipWrapper } from '@noita-explorer/noita-component-library';
import { Flex } from '../../../components/flex.tsx';

export const NoitaProgressTrackerPillar = () => {
  const { flags } = useSave00Store();
  const pillarColumns = useNoitaProgressTrackerPillarDefinitions();
  const longestPillar = pillarColumns.reduce(
    (tallest, current) => (tallest > current.length ? tallest : current.length),
    0,
  );

  return (
    <div style={{ padding: 10 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${pillarColumns.length}, 1fr)`,
        }}
      >
        {enumerateHelpers.rangeTo(longestPillar + 1).map((row) => {
          return (
            <>
              {pillarColumns.map((column) => {
                const index = longestPillar - row;
                const pillar = column[index];

                if (!pillar) {
                  return <div></div>;
                }

                const shouldBeColored =
                  !pillar.flag || flags?.has(pillar.flag ?? '');

                return (
                  <NoitaTooltipWrapper placement='right' content={pillar.info}>
                    <Flex height={140}>
                      <img
                        src={pillar.img}
                        alt={pillar.title}
                        title={pillar.title}
                        height={140}
                        style={{
                          imageRendering: 'pixelated',
                          filter: shouldBeColored ? '' : 'grayscale()',
                        }}
                      />
                    </Flex>
                  </NoitaTooltipWrapper>
                );
              })}
            </>
          );
        })}
      </div>
    </div>
  );
};
