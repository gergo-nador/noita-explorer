import { XmlTagDeclaration } from '../interfaces/xml-inner-types.ts';

export const convertStringTag = (
  tag: string | XmlTagDeclaration,
): XmlTagDeclaration => {
  if (typeof tag === 'string') {
    return { _: tag.trim() } as XmlTagDeclaration;
  }

  return tag;
};
