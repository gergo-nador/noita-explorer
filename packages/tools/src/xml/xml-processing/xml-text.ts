import { XmlRawTagDeclaration } from './xml-pre-process.types.ts';
import { XmlTagDeclaration } from '../interfaces/xml-tag-declaration.ts';

export const convertStringTag = (
  tag: string | XmlRawTagDeclaration,
): XmlRawTagDeclaration => {
  if (typeof tag === 'string') {
    return { _: tag.trim() } as XmlTagDeclaration;
  }

  return tag;
};

export const convertXmlArrayInPlace = (
  array: (XmlRawTagDeclaration | string)[],
): XmlRawTagDeclaration[] => {
  for (let i = 0; i < array.length; i++) {
    array[i] = convertStringTag(array[i]);
  }

  return array as XmlTagDeclaration[];
};
