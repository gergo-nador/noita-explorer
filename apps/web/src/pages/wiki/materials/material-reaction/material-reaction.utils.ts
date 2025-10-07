import {
  NoitaMaterial,
  NoitaMaterialReactionComponent,
} from '@noita-explorer/model-noita';

type ParsedReactionType =
  | { type: 'material-id'; id: string }
  | { type: 'material-tag'; tag: string; extension: string | undefined };

export function parseReactionMaterial(material: string): ParsedReactionType {
  const includesSquareBrackets =
    material.includes('[') || material.includes(']');
  if (!includesSquareBrackets) {
    return {
      type: 'material-id',
      id: material,
    };
  }

  const tagParseRegex = /^\[(.*?)](?:_(\w+))?$/;
  const match = tagParseRegex.exec(material);
  if (!match) {
    throw new Error('Material tag regex not matched');
  }

  const materialTag = `[${match[1]}]`;
  const materialTagExtension = match[2];

  return {
    type: 'material-tag',
    tag: materialTag,
    extension: materialTagExtension,
  };
}

/**
 * Returns if a matterial matches the reaction component
 * @param material
 * @param reactionComponent
 */
export const isComponentTheMaterial = (
  material: NoitaMaterial,
  reactionComponent: NoitaMaterialReactionComponent,
): boolean => {
  const reactionMaterial = parseReactionMaterial(reactionComponent.componentId);
  if (reactionMaterial.type === 'material-id') {
    return reactionMaterial.id === material.id;
  }

  if (reactionMaterial.type === 'material-tag') {
    if (reactionMaterial.extension) return false;
    return material.tags.includes(reactionMaterial.tag);
  }

  return false;
};
