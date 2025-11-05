import { NoitaWandCard } from '../components/noita-wand-card.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { useMemo } from 'react';
import { Button } from '@noita-explorer/noita-component-library';
import { useNoitaActionsStore } from '../stores/actions.ts';
import { useSave00Service } from '../services/save00/use-save00-service.ts';

export const NoitaBonesWands = () => {
  const { bonesWands } = useSave00Service();
  const { actionUtils } = useNoitaActionsStore();

  const bonesWandsSorted = useMemo(() => {
    const arr = [...bonesWands];

    // sort by wand card height. not 100% punctual but good enough
    arr.sort((wandBonesFile1, wandBonesFile2) => {
      const w1 = wandBonesFile1.wand;
      const w2 = wandBonesFile2.wand;

      const deckCapacity = w1.deckCapacity - w2.deckCapacity;

      if (w1.alwaysCastSpells.length > 0 && w2.alwaysCastSpells.length > 0) {
        return deckCapacity;
      }

      if (w1.alwaysCastSpells.length > 0) {
        return deckCapacity + 9;
      }

      if (w2.alwaysCastSpells.length > 0) {
        return deckCapacity - 9;
      }

      return deckCapacity;
    });

    return arr;
  }, [bonesWands]);

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
        <Button
          onClick={() => {
            bonesWands?.forEach((wand) =>
              actionUtils.deleteBonesWand.create(wand.fileName),
            );
          }}
        >
          Delete all
        </Button>
      </div>
      <Flex gap={20} align='flex-start' justify='center' wrap>
        {bonesWandsSorted.map((wandFile) => (
          <NoitaWandCard
            key={wandFile.fileName}
            wand={wandFile.wand}
            bonesFileName={wandFile.fileName}
          />
        ))}
      </Flex>
    </div>
  );
};
