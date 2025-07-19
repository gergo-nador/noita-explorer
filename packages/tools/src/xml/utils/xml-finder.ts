import { isChild } from './child.ts';
import { XmlTagDeclaration } from '../interfaces/xml-tag-declaration.ts';
import { XmlRootDeclaration } from '../interfaces/xml-root-declaration.ts';

export type XmlFindable = XmlRootDeclaration | XmlTagDeclaration;

/**
 * Finds the first XML tag declaration with the specified name.
 * Returns the array of tags found at the path of the found XML tag.
 * @param xmlObject
 * @param name
 */
export const findTagArray = (
  xmlObject: XmlFindable,
  name: string,
): XmlTagDeclaration[] => {
  const tag = findXmlTag(xmlObject, name);

  if (!tag) {
    return [];
  }

  if (!Array.isArray(tag)) {
    return [tag];
  }

  return tag;
};

/**
 * Traverses through the entire XML structure and returns all the
 * tags with the given name.
 * @param xmlObject
 * @param tagName
 * @param tags
 */
export const findAllTagsRecursively = (
  xmlObject: XmlFindable,
  tagName: string,
  tags: XmlTagDeclaration[] = [],
): XmlTagDeclaration[] => {
  for (const key in xmlObject) {
    // skip the text content and the attributes
    if (!isChild(key)) {
      continue;
    }

    const tagNameMatch = key === tagName;
    const tag = xmlObject[key];

    if (!Array.isArray(tag)) {
      if (tagNameMatch) {
        tags.push(tag);
      }

      findAllTagsRecursively(tag, tagName, tags);
      continue;
    }

    for (let i = 0; i < tag.length; i++) {
      if (tagNameMatch) {
        tags.push(tag[i]);
      }

      findAllTagsRecursively(tag[i], tagName, tags);
    }
  }

  return tags;
};

/**
 * Finds the first XML tag with the specified name. If the declaration is an array of tags,
 * it returns the nth tag from the array.
 * @param xmlObject
 * @param name
 * @param index
 */
export const findNthTag = (
  xmlObject: XmlFindable,
  name: string,
  index = 0,
): XmlTagDeclaration | undefined => {
  const tag = findXmlTag(xmlObject, name);

  if (!tag) {
    return undefined;
  }
  if (!Array.isArray(tag)) {
    return tag;
  }
  if (tag.length - 1 < index) {
    throw new Error('Index out of range');
  }
  const nthTag = tag[index];
  return nthTag;
};

/**
 * Finds the first XML tag with the specified tag name
 * @param xmlObject the xml object to traverse through
 * @param tagName the tag name to find
 */
const findXmlTag = (
  xmlObject: XmlFindable,
  tagName: string,
): XmlTagDeclaration | XmlTagDeclaration[] | undefined => {
  if (xmlObject === undefined) {
    throw new Error(`xmlObject is undefined for tag name ${tagName}`);
  }

  for (const key in xmlObject) {
    // skip the text content and the attributes
    if (!isChild(key)) {
      continue;
    }

    const tagNameMatch = key === tagName;
    const tags = xmlObject[key];

    if (!Array.isArray(tags)) {
      if (tagNameMatch) {
        return tags;
      }

      const result = findXmlTag(tags, tagName);
      if (result) {
        return result;
      }

      continue;
    }

    if (tagNameMatch) {
      return tags;
    }

    for (const tag of tags) {
      const result = findXmlTag(tag, tagName);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};
