import {
  NoitaMaterial,
  NoitaMaterialReaction,
} from '@noita-explorer/model-noita';
import { BooleanIcon, Card } from '@noita-explorer/noita-component-library';
import { MaterialReactionComponent } from './material-reaction-component.tsx';
import { use, useMemo } from 'react';
import { Flex } from '@noita-explorer/react-utils';
import { MaterialReactionProcessed } from './material-reaction.types.ts';
import { parseReactionMaterial } from './material-reaction.utils.ts';
import { WikiMaterialsContext } from '../wiki-materials.context.ts';

interface Props {
  reaction: NoitaMaterialReaction;
  currentMaterial: NoitaMaterial;
}

export const MaterialReaction = ({ reaction, currentMaterial }: Props) => {
  const { materialsLookup } = use(WikiMaterialsContext);

  const components = useMemo(() => {
    // materials that are both the source and the product of the reaction
    const persistentComponents: MaterialReactionProcessed[] = [];
    // materials only found as the source of the reaction
    const inputComponents: MaterialReactionProcessed[] = [
      ...reaction.inputComponents.map((c) => ({
        ...c,
        parsed: parseReactionMaterial(c.componentId),
      })),
    ];
    // materials only found in the product of the reaction
    const outputComponents: MaterialReactionProcessed[] = [
      ...reaction.outputComponents.map((c) => ({
        ...c,
        parsed: parseReactionMaterial(c.componentId),
      })),
    ];

    // group the input/output/persistent components
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

    const allComponents = [
      ...persistentComponents,
      ...inputComponents,
      ...outputComponents,
    ];

    // find whether the current material matches the tag or the id
    const hasIdMatch = allComponents.some(
      (component) =>
        component.parsed.type === 'material-id' &&
        component.parsed.id === currentMaterial.id,
    );

    // if there is no id match, convert the tags to the current material
    if (!hasIdMatch) {
      for (const component of allComponents) {
        if (component.parsed.type !== 'material-tag') continue;
        const tag = component.parsed.tag;
        const extension = component.parsed.extension;

        // if the tag matches and no extension, we display the current material
        if (!extension && currentMaterial.tags.includes(tag)) {
          component.overrideComponentId = currentMaterial.id;
          continue;
        }

        // if the tag matches and extension is there, we find the product material
        if (extension && currentMaterial.tags.includes(tag)) {
          const productMaterialId = `${currentMaterial.id}_${extension}`;
          const productMaterialExists = productMaterialId in materialsLookup;

          if (productMaterialExists) {
            component.overrideComponentId = productMaterialId;
          }
          continue;
        }

        // if the extension matches the current material, find the source material
        if (extension && currentMaterial.id.endsWith(extension)) {
          const sourceMaterialId = currentMaterial.id.substring(
            0,
            currentMaterial.id.length - extension.length - 1,
          );
          const sourceMaterialExists = sourceMaterialId in materialsLookup;

          if (sourceMaterialExists) {
            component.overrideComponentId = currentMaterial.id;
          }
        }
      }
    }

    return {
      persistentComponents,
      inputComponents,
      outputComponents,
    };
  }, [reaction, materialsLookup, currentMaterial]);

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
                reactionComponent={persistentComponent}
              />
            </div>
            <div>---</div>
            <div style={{ justifySelf: 'end' }}>
              <MaterialReactionComponent
                reactionComponent={persistentComponent}
              />
            </div>
          </>
        ))}
        <div style={{ justifySelf: 'start' }}>
          {components.inputComponents.map((component) => (
            <MaterialReactionComponent reactionComponent={component} />
          ))}
        </div>
        <Flex align='center'>{'-->'}</Flex>
        <div style={{ justifySelf: 'end' }}>
          {components.outputComponents.map((component) => (
            <MaterialReactionComponent reactionComponent={component} />
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
