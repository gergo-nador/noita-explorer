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
