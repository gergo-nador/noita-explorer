import {
  NoitaMaterialReaction,
  NoitaMaterialReactionComponent,
} from '@noita-explorer/model-noita';
import { Card } from '@noita-explorer/noita-component-library';
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
          justifyItems: 'center',
        }}
      >
        {components.persistentComponents.map((persistentComponent) => (
          <>
            <div>
              <MaterialReactionComponent
                reactionComponent={persistentComponent.componentId}
              />
            </div>
            <div>----</div>
            <div>
              <MaterialReactionComponent
                reactionComponent={persistentComponent.componentId}
              />
            </div>
          </>
        ))}
        <div>
          {components.inputComponents.map((component) => (
            <MaterialReactionComponent
              reactionComponent={component.componentId}
            />
          ))}
        </div>
        <Flex align='center'>{'-->'}</Flex>
        <div>
          {components.outputComponents.map((component) => (
            <MaterialReactionComponent
              reactionComponent={component.componentId}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
