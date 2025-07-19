import { XmlRootDeclaration } from '../interfaces/xml-root-declaration.ts';
import { XmlTagDeclaration } from '../interfaces/xml-tag-declaration.ts';
import { isChild } from '../utils/child.ts';

export const xmlPostProcess = (xml: XmlRootDeclaration): XmlRootDeclaration => {
  xml = { ...xml };
  delete xml['_parentInfo'];

  for (const key of Object.keys(xml)) {
    if (!isChild(key)) {
      continue;
    }

    xml[key] = xmlPostProcessTag(xml[key]);
  }

  return xml;
};

const xmlPostProcessTag = (xml: XmlTagDeclaration): XmlTagDeclaration => {
  xml = { ...xml };
  delete xml['_parentInfo'];

  const keys = Object.keys(xml);
  for (const key of keys) {
    if (!isChild(key)) continue;

    xml[key] = [...xml[key]];
    const childArray = xml[key];

    for (let i = 0; i < childArray.length; i++) {
      childArray[i] = xmlPostProcessTag(childArray[i]);
    }
  }

  return xml;
};
