import { Header } from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { MaterialReaction } from './material-reaction/material-reaction.tsx';
import { useFilterMaterialReactions } from './material-reaction/use-filter-material-reactions.ts';
import { NoitaMaterial } from '@noita-explorer/model-noita';
import { CSSProperties } from 'react';

interface Props {
  material: NoitaMaterial;
}

export const MaterialOverviewReactions = ({ material }: Props) => {
  const { reactions } = useFilterMaterialReactions({ material });
  if (!reactions) return;

  const hasSourceReactions = reactions.sourceReactions.length > 0;
  const hasProductReactions = reactions.productReactions.length > 0;
  const hasPersistentReactions = reactions.persistentReactions.length > 0;

  const getTitleCss = (hasReaction: boolean): CSSProperties => ({
    textDecoration: !hasReaction ? 'line-through' : undefined,
  });

  return (
    <>
      <Header
        titleCss={getTitleCss(hasSourceReactions)}
        title={`Source Reactions (${reactions.sourceReactions.length})`}
      >
        <Flex column gap={8}>
          {reactions.sourceReactions.map((reaction, index) => (
            <MaterialReaction
              key={index}
              reaction={reaction}
              currentMaterial={material}
            />
          ))}
        </Flex>
      </Header>
      {hasSourceReactions && <br />}
      <Header
        titleCss={getTitleCss(hasProductReactions)}
        title={`Product Reactions (${reactions.productReactions.length})`}
      >
        <Flex column gap={8}>
          {reactions.productReactions.map((reaction, index) => (
            <MaterialReaction
              key={index}
              reaction={reaction}
              currentMaterial={material}
            />
          ))}
        </Flex>
      </Header>
      {hasProductReactions && <br />}
      <Header
        titleCss={getTitleCss(hasPersistentReactions)}
        title={`Persistent Reactions (${reactions.persistentReactions.length})`}
      >
        <Flex column gap={8}>
          {reactions.persistentReactions.map((reaction, index) => (
            <MaterialReaction
              key={index}
              reaction={reaction}
              currentMaterial={material}
            />
          ))}
        </Flex>
      </Header>
    </>
  );
};
