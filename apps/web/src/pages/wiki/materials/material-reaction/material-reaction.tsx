import {
  NoitaMaterialReaction,
  NoitaMaterialReactionComponent,
} from '@noita-explorer/model-noita';
import { BooleanIcon, Card } from '@noita-explorer/noita-component-library';
import { MaterialReactionComponent } from './material-reaction-component.tsx';
import { useMemo } from 'react';
import { Flex } from '@noita-explorer/react-utils';

interface Props {
  reaction: NoitaMaterialReaction;
}

export const MaterialReaction = ({ reaction }: Props) => {
  const components = useMemo(() => {
    const persistentComponents: NoitaMaterialReactionComponent[] = [];
    const inputComponents: NoitaMaterialReactionComponent[] = [
      ...reaction.inputComponents,
    ];
    const outputComponents: NoitaMaterialReactionComponent[] = [
      ...reaction.outputComponents,
    ];

    for (let i = 0; i < inputComponents.length; i++) {
      const inputComponent = inputComponents[i];
      const matchingOutputComponent = outputComponents.findIndex(
        (o) => o.componentId === inputComponent.componentId,
      );

      if (matchingOutputComponent === -1) continue;

      persistentComponents.push(inputComponent);
      inputComponents.splice(i, 1);
      outputComponents.splice(matchingOutputComponent, 1);
      i--;
    }

    return { persistentComponents, inputComponents, outputComponents };
  }, [reaction]);

  return (
    <Card>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr max-content 1fr',
        }}
      >
        {components.persistentComponents.map((persistentComponent) => (
          <>
            <div style={{ justifySelf: 'start' }}>
              <MaterialReactionComponent
                reactionComponent={persistentComponent.componentId}
              />
            </div>
            <div>----</div>
            <div style={{ justifySelf: 'end' }}>
              <MaterialReactionComponent
                reactionComponent={persistentComponent.componentId}
              />
            </div>
          </>
        ))}
        <div style={{ justifySelf: 'start' }}>
          {components.inputComponents.map((component) => (
            <MaterialReactionComponent
              reactionComponent={component.componentId}
            />
          ))}
        </div>
        <Flex align='center'>{'-->'}</Flex>
        <div style={{ justifySelf: 'end' }}>
          {components.outputComponents.map((component) => (
            <MaterialReactionComponent
              reactionComponent={component.componentId}
            />
          ))}
        </div>
      </div>
      <hr style={{ margin: '1rem 0' }} />
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'max-content 1rem',
          gap: '0 3rem',
        }}
      >
        <>
          <div>Probability</div>
          <div>{reaction.probability}%</div>
        </>
        {reaction.fastReaction && (
          <>
            <div>Fast reaction</div>
            <div>
              <BooleanIcon value={reaction.fastReaction} />
            </div>
          </>
        )}
        {reaction.convertAll && (
          <>
            <div>Convert all</div>
            <div>
              <BooleanIcon value={reaction.convertAll} />
            </div>
          </>
        )}
        {reaction.explosion && (
          <>
            <div>Explosion</div>
            <div>
              <BooleanIcon value={Boolean(reaction.explosion)} />
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
