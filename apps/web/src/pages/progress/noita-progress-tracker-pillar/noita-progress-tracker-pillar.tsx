import { useNoitaProgressTrackerPillarDefinitions } from './noita-progress-tracker-pillar-definitions.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { NoitaProgressTrackerPillarItem } from './noita-progress-tracker-pillar-item.tsx';

export const NoitaProgressTrackerPillar = () => {
  const pillarColumns = useNoitaProgressTrackerPillarDefinitions();

  return (
    <Flex justify='center' style={{ padding: 10 }}>
      <Flex justify='space-around' width='100%' style={{ maxWidth: '1200px' }}>
        {pillarColumns.map((pillarColumn, columnIndex) => {
          return (
            <Flex column justify='end' key={String(columnIndex)}>
              {pillarColumn.map((pillar, pillarIndex) => (
                <NoitaProgressTrackerPillarItem
                  pillar={pillar}
                  key={`${pillar.title}-${pillarIndex}-${columnIndex}`}
                />
              ))}
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};
