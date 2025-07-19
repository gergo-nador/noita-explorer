import { XmlTagDeclaration } from '../interfaces/xml-tag-declaration.ts';

export const addNewChild = (
  xmlObject: XmlTagDeclaration,
  tagName: string,
): XmlTagDeclaration => {
  const child = {} as XmlTagDeclaration;

  addChild(xmlObject, tagName, child);

  return child;
};

export const addChild = (
  xmlObject: XmlTagDeclaration,
  tagName: string,
  xmlChild: XmlTagDeclaration,
  index?: number,
) => {
  if (!(tagName in xmlObject)) {
    xmlObject[tagName] = [];
  }

  const list = xmlObject[tagName];
  xmlChild._parentInfo = { parent: xmlObject, tagName };

  if (index !== undefined) {
    index = Math.max(index, 0);
    index = Math.min(index, list.length);
    list.splice(index, 0, xmlChild);
  } else {
    list.push(xmlChild);
  }
};

export const isChild = (key: string) => {
  return key !== '_' && key !== '$' && key !== '_parentInfo';
};
