import {
  NoitaMaterial,
  NoitaMaterialReaction,
} from '@noita-explorer/model-noita';
import { BooleanIcon, Card } from '@noita-explorer/noita-component-library';
import { MaterialReactionComponent } from './material-reaction-component.tsx';
import { Flex } from '@noita-explorer/react-utils';
import { useProcessMaterialReaction } from './use-process-material-reaction.ts';
import React from 'react';

interface Props {
  reaction: NoitaMaterialReaction;
  currentMaterial: NoitaMaterial;
}

export const MaterialReaction = ({ reaction, currentMaterial }: Props) => {
  const {
    persistentComponents,
    extensionComponents,
    inputComponents,
    outputComponents,
  } = useProcessMaterialReaction({ reaction, currentMaterial });

  return (
    <Card>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr max-content 1fr',
        }}
      >
        {persistentComponents.map((persistentComponent) => (
          <React.Fragment key={persistentComponent.componentId}>
            <div style={{ justifySelf: 'start' }}>
              <MaterialReactionComponent
                reactionComponent={persistentComponent}
              />
            </div>
            <div>---</div>
            <div style={{ justifySelf: 'end' }}>
              <MaterialReactionComponent
                reactionComponent={persistentComponent}
              />
            </div>
          </React.Fragment>
        ))}
        {extensionComponents.map((extension) => (
          <React.Fragment key={extension[0].componentId}>
            <div style={{ justifySelf: 'start' }}>
              <MaterialReactionComponent reactionComponent={extension[0]} />
            </div>
            <div>{'-->'}</div>
            <div style={{ justifySelf: 'end' }}>
              <MaterialReactionComponent reactionComponent={extension[1]} />
            </div>
          </React.Fragment>
        ))}
        {(inputComponents.length > 0 || outputComponents.length > 0) && (
          <>
            <div style={{ justifySelf: 'start' }}>
              {inputComponents.map((component, index) => (
                <MaterialReactionComponent
                  key={component.componentId + index}
                  reactionComponent={component}
                />
              ))}
            </div>
            <Flex align='center'>{'-->'}</Flex>
            <div style={{ justifySelf: 'end' }}>
              <Flex column align='end'>
                {outputComponents.map((component, index) => (
                  <MaterialReactionComponent
                    key={component.componentId + index}
                    reactionComponent={component}
                  />
                ))}
              </Flex>
            </div>
          </>
        )}
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
