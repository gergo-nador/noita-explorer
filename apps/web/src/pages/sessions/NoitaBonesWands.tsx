import { useSave00Store } from '../../stores/save00.ts';
import { NoitaWandCard } from '../../components/NoitaWandCard.tsx';
import { Flex } from '../../components/Flex.tsx';

export const NoitaBonesWands = () => {
  const { bonesWands } = useSave00Store();

  console.log(bonesWands);

  return (
    <div>
      <Flex gap={20} style={{ flexDirection: 'column' }}>
        {bonesWands?.map((wand) => <NoitaWandCard wand={wand} />)}
      </Flex>
    </div>
  );
};
