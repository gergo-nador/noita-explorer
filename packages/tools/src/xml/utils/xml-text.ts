import { XmlTagDeclaration } from '../interfaces/xml-inner-types.ts';

export const convertStringTag = (
  tag: string | XmlTagDeclaration,
): XmlTagDeclaration => {
  if (typeof tag === 'string') {
    return { _: tag } as XmlTagDeclaration;
  }

  return tag;
};
