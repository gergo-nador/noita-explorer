import { convertStringTag, convertXmlArrayInPlace } from './xml-text.ts';
import {
  XmlRawRootDeclaration,
  XmlRawTagDeclaration,
} from './xml-pre-process.types.ts';
import { isChild } from '../utils/child.ts';
import { XmlRootDeclaration } from '../interfaces/xml-root-declaration.ts';

export const xmlPreProcess = (
  xml: XmlRawRootDeclaration,
): XmlRootDeclaration => {
  const keys = Object.keys(xml);
  for (const key of keys) {
    if (!isChild(key)) continue;

    xml[key] = convertStringTag(xml[key]);
    xml[key]._parentInfo = {
      parent: xml,
      tagName: key,
    };
    xml[key] = xmlParseTagPreProcess(xml[key]);
  }

  return xml as XmlRootDeclaration;
};

const xmlParseTagPreProcess = (
  xml: XmlRawTagDeclaration,
): XmlRawTagDeclaration => {
  const keys = Object.keys(xml);
  for (const key of keys) {
    if (!isChild(key)) continue;

    const childArray = xml[key];
    const convertedChildArray = convertXmlArrayInPlace(childArray);

    for (const child of convertedChildArray) {
      child._parentInfo = {
        parent: xml,
        tagName: key,
      };
      xmlParseTagPreProcess(child);
    }
  }

  return xml;
};
