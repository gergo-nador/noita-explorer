import { XmlAttributeReadOptions } from './XmlAttributeReadOptions';
import { StringKeyDictionaryComposite } from '@noita-explorer/model';

export interface XmlWrapperType {
  _getCurrentXmlObj: () => object;
  findNthTag: (tagName: string, index?: number) => XmlWrapperType | undefined;
  findTagArray: (tagName: string) => XmlWrapperType[];
  findAllTags: (tagName: string) => XmlWrapperType[];
  getAttribute: (attributeName: string) => XmlAttributeReadOptions | undefined;
  getRequiredAttribute: (attributeName: string) => XmlAttributeReadOptions;
  getTextContent: () => string | undefined;
}

/**
 * Wrapper object providing many utility methods
 * @param xmlObj
 * @constructor
 */
export const XmlWrapper = (
  xmlObj: StringKeyDictionaryComposite<string> | string,
): XmlWrapperType => {
  if (xmlObj === undefined) {
    throw new Error('xmlObj is undefined');
  }

  // if a tag only contains a string value without any properties
  // or other children, the value will be a single string.
  if (typeof xmlObj === 'string') {
    xmlObj = {
      _: xmlObj,
    };
  }
  if (typeof xmlObj !== 'object') {
    throw new Error('xmlObj is not an object, but a ' + typeof xmlObj);
  }

  return {
    _getCurrentXmlObj: () => xmlObj,
    findNthTag: (tagName, index) => findNthTag(xmlObj, tagName, index),
    findTagArray: (tagName) => findTagArray(xmlObj, tagName),
    findAllTags: (tagName) => findAllTagsRecursively(xmlObj, tagName),
    getAttribute: (attributeName) => getAttribute(xmlObj, attributeName),
    getRequiredAttribute: (attributeName) => {
      const attr = getAttribute(xmlObj, attributeName);
      if (attr === undefined) {
        throw new Error(
          `Could not find attribute ${attributeName} in ${JSON.stringify(xmlObj)}`,
        );
      }

      return attr;
    },
    getTextContent: () => getTextContent(xmlObj),
  };
};

const getTextContent = (
  xmlObject: StringKeyDictionaryComposite<string>,
): string | undefined => {
  if ('_' in xmlObject) {
    const content = xmlObject['_'];
    if (typeof content === 'string') {
      return content.trim();
    }
  }

  if (Array.isArray(xmlObject)) {
    const text = xmlObject.find((inner) => typeof inner === 'string');
    return text?.trim();
  }

  return undefined;
};

/**
 * Finds the first XML tag declaration with the specified name.
 * Returns the array of tags found at the path of the found XML tag.
 * @param xmlObject
 * @param name
 */
const findTagArray = (
  xmlObject: StringKeyDictionaryComposite<string>,
  name: string,
) => {
  const tag = findXmlTag(xmlObject, name);

  if (typeof tag !== 'object') {
    return [];
  }
  if (!Array.isArray(tag)) {
    return [XmlWrapper(tag)];
  }

  return tag.map((t) => XmlWrapper(t));
};

/**
 * Traverses through the entire XML structure and returns all the
 * tags with the given name.
 * @param xmlObject
 * @param tagName
 * @param tags
 */
const findAllTagsRecursively = (
  xmlObject: StringKeyDictionaryComposite<string>,
  tagName: string,
  tags: XmlWrapperType[] = [],
): XmlWrapperType[] => {
  if (Array.isArray(xmlObject)) {
    for (const item of xmlObject) {
      if (typeof item === 'object') {
        findAllTagsRecursively(item, tagName, tags);
      }
    }
  } else {
    for (const key in xmlObject) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const value = xmlObject[key];

      if (typeof value === 'object') {
        findAllTagsRecursively(value, tagName, tags);
      }
    }
  }

  if (!(tagName in xmlObject)) {
    return tags;
  }

  const tag = xmlObject[tagName];

  if (typeof tag !== 'object') {
    return tags;
  }
  if (!Array.isArray(tag)) {
    const xmlWrapper = XmlWrapper(tag);
    tags.push(xmlWrapper);
    return tags;
  }

  tag.map((t) => XmlWrapper(t)).forEach((xml) => tags.push(xml));

  return tags;
};

/**
 * Finds the first XML tag with the specified name. If the declaration is an array of tags,
 * it returns the nth tag from the array.
 * @param xmlObject
 * @param name
 * @param index
 */
const findNthTag = (
  xmlObject: StringKeyDictionaryComposite<string>,
  name: string,
  index = 0,
) => {
  const tag = findXmlTag(xmlObject, name);

  if (typeof tag !== 'object') {
    return undefined;
  }
  if (!Array.isArray(tag)) {
    return XmlWrapper(tag);
  }
  if (tag.length - 1 < index) {
    throw new Error('Index out of range');
  }
  const nthTag = tag[index];
  if (typeof nthTag !== 'object') {
    return undefined;
  }
  return XmlWrapper(nthTag);
};

/**
 * Gets an attribute from a XML tag.
 * @param xmlObject
 * @param name
 */
const getAttribute = (
  xmlObject: StringKeyDictionaryComposite<string>,
  name: string,
): XmlAttributeReadOptions | undefined => {
  if (!('$' in xmlObject) || typeof xmlObject['$'] !== 'object') {
    return undefined;
  }

  const attributes = xmlObject['$'];

  if (attributes == null || !(name in attributes)) {
    return undefined;
  }

  const value = attributes[name] as string | undefined;
  if (value === undefined) {
    return undefined;
  }

  return {
    asInt: () => {
      const result = parseInt(value);
      if (isNaN(result)) return undefined;
      return result;
    },
    asFloat: () => {
      const result = parseFloat(value);
      if (isNaN(result)) return undefined;
      return result;
    },
    asBoolean: () => {
      return value === 'true' || value === '1';
    },
    asText: () => value,
  };
};

/**
 * Finds the first XML tag with the specified tag name
 * @param xmlObject the xml object to traverse through
 * @param tagName the tag name to find
 */
const findXmlTag = (
  xmlObject: StringKeyDictionaryComposite<string>,
  tagName: string,
): StringKeyDictionaryComposite<string> | string | undefined => {
  if (xmlObject === undefined) {
    throw new Error(`xmlObject is undefined for tag name ${tagName}`);
  }

  if (tagName in xmlObject) {
    return xmlObject[tagName];
  }

  if (Array.isArray(xmlObject)) {
    for (const item of xmlObject) {
      if (typeof item === 'object') {
        const result = findXmlTag(item, tagName);
        if (result !== undefined) return result;
      }
    }
  } else {
    for (const key in xmlObject) {
      const value = xmlObject[key];

      if (typeof value === 'object') {
        const result = findXmlTag(value, tagName);
        if (result !== undefined) return result;
      }
    }
  }

  return undefined;
};
