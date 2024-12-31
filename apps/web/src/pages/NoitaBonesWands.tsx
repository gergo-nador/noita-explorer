import { useSave00Store } from '../stores/save00.ts';
import { NoitaWandCard } from '../components/NoitaWandCard.tsx';
import { Flex } from '../components/Flex.tsx';

export const NoitaBonesWands = () => {
  const { bonesWands } = useSave00Store();

  if (bonesWands === undefined) {
    return <div>Bones not loaded</div>;
  }

  return (
    <div>
      <Flex
        gap={20}
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        {bonesWands?.map((wand) => <NoitaWandCard wand={wand} />)}
      </Flex>
    </div>
  );
};
