import { useMemo } from 'react';
import { MaterialReactionProcessed } from './material-reaction.types.ts';
import { parseReactionMaterial } from './material-reaction.utils.ts';
import {
  NoitaMaterial,
  NoitaMaterialReaction,
} from '@noita-explorer/model-noita';
import { useNoitaDataWakStore } from '../../../../stores/noita-data-wak.ts';

interface Props {
  reaction: NoitaMaterialReaction;
  currentMaterial: NoitaMaterial;
}

export const useProcessMaterialReaction = ({
  reaction,
  currentMaterial,
}: Props) => {
  const { lookup } = useNoitaDataWakStore();

  type MaterialReactionComponent = {
    persistentComponents: MaterialReactionProcessed[];
    extensionComponents: [
      MaterialReactionProcessed,
      MaterialReactionProcessed,
    ][];
    inputComponents: MaterialReactionProcessed[];
    outputComponents: MaterialReactionProcessed[];
  };

  const components: MaterialReactionComponent = useMemo(() => {
    if (!lookup?.materials)
      return {
        persistentComponents: [],
        extensionComponents: [],
        inputComponents: [],
        outputComponents: [],
      } satisfies MaterialReactionComponent;

    // materials that are both the source and the product of the reaction
    const persistentComponents: MaterialReactionProcessed[] = [];
    // components that are converted with an extension (e.g. steel --> steel_molten)
    const extensionComponents: [
      MaterialReactionProcessed,
      MaterialReactionProcessed,
    ][] = [];
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

    // find the extension components
    for (let i = 0; i < inputComponents.length; i++) {
      const inputComponent = inputComponents[i];
      if (inputComponent.parsed.type !== 'material-tag') continue;
      const inputTag = inputComponent.parsed.tag;

      const matchingOutputComponent = outputComponents.findIndex(
        (o) => o.parsed.type === 'material-tag' && o.parsed.tag === inputTag,
      );

      if (matchingOutputComponent === -1) continue;
      const outputComponent = outputComponents[matchingOutputComponent];
      extensionComponents.push([inputComponent, outputComponent]);

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
        }
      }

      for (const extensionComponent of extensionComponents) {
        const inputComponent = extensionComponent[0];
        const outputComponent = extensionComponent[1];

        if (inputComponent.parsed.type !== 'material-tag') continue;
        if (outputComponent.parsed.type !== 'material-tag') continue;

        const inputTag = inputComponent.parsed.tag;
        const inputExtension = inputComponent.parsed.extension;
        const outputTag = outputComponent.parsed.tag;
        const outputExtension = outputComponent.parsed.extension;

        // if the current material is the source material and extension is on the product side
        // ([current_mat] --> [current_mat]_ext)
        if (outputExtension && currentMaterial.tags.includes(inputTag)) {
          inputComponent.overrideComponentId = currentMaterial.id;
          outputComponent.overrideComponentId = `${currentMaterial.id}_${outputExtension}`;
          continue;
        }

        // if the current material is the product material and extension is on the source material
        // ([current_mat]_ext --> [current_mat])
        if (inputExtension && currentMaterial.tags.includes(outputTag)) {
          inputComponent.overrideComponentId = `${currentMaterial.id}_${inputExtension}`;
          outputComponent.overrideComponentId = currentMaterial.id;
          continue;
        }

        // if the current material is the product material with extension
        // ([parent_mat] --> [parent_mat]_ext where [parent_mat]_ext == current_mat)
        if (outputExtension && currentMaterial.id.endsWith(outputExtension)) {
          const parentMaterialId = currentMaterial.id.substring(
            0,
            currentMaterial.id.length - outputExtension.length - 1,
          );

          const parentMaterialExists = parentMaterialId in lookup.materials;

          if (parentMaterialExists) {
            inputComponent.overrideComponentId = parentMaterialId;
            outputComponent.overrideComponentId = currentMaterial.id;
          }
        }

        // if the current material is the product material with extension
        // ([parent_mat]_ext --> [parent_mat] where [parent_mat]_ext == current_mat)
        if (inputExtension && currentMaterial.id.endsWith(inputExtension)) {
          const parentMaterialId = currentMaterial.id.substring(
            0,
            currentMaterial.id.length - inputExtension.length - 1,
          );

          const parentMaterialExists = parentMaterialId in lookup.materials;

          if (parentMaterialExists) {
            inputComponent.overrideComponentId = currentMaterial.id;
            outputComponent.overrideComponentId = parentMaterialId;
          }
        }
      }
    }

    return {
      persistentComponents,
      extensionComponents,
      inputComponents,
      outputComponents,
    } satisfies MaterialReactionComponent;
  }, [reaction, lookup?.materials, currentMaterial]);

  return components;
};
