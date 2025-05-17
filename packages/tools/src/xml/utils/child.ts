import { XmlTagDeclaration } from '../interfaces/xml-inner-types.ts';

export const addChild = (
  xmlObject: XmlTagDeclaration,
  tagName: string,
): XmlTagDeclaration => {
  if (!(tagName in xmlObject)) {
    xmlObject[tagName] = [];
  }

  const list = xmlObject[tagName];
  const child = {};
  list.push(child);
  return child;
};
