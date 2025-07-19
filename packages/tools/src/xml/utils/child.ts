import { XmlTagDeclaration } from '../interfaces/xml-tag-declaration.ts';

export const addChild = (
  xmlObject: XmlTagDeclaration,
  tagName: string,
): XmlTagDeclaration => {
  if (!(tagName in xmlObject)) {
    xmlObject[tagName] = [];
  }

  const list = xmlObject[tagName];
  const child = {
    _parentInfo: { parent: xmlObject, tagName },
  } as XmlTagDeclaration;

  list.push(child);
  return child;
};

export const isChild = (key: string) => {
  return key !== '_' && key !== '$' && key !== '_parentInfo';
};
