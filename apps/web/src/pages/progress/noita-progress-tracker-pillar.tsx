import { noitaProgressTrackerPillarDefinitions } from './noita-progress-tracker-pillar-definitions.tsx';
import { enumerateHelpers } from '@noita-explorer/tools';

export const NoitaProgressTrackerPillar = () => {
  const pillarColumns = noitaProgressTrackerPillarDefinitions();
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

                return (
                  <div style={{ height: 140 }}>
                    <img
                      src={pillar.img}
                      alt={pillar.title}
                      title={pillar.title}
                      height={140}
                      style={{
                        imageRendering: 'pixelated',
                        filter: pillar.flag ? '' : 'grayscale()',
                      }}
                    />
                  </div>
                );
              })}
            </>
          );
        })}
      </div>
    </div>
  );
};
