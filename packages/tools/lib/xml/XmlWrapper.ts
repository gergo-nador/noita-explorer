import { XmlAttributeReadOptions } from './XmlAttributeReadOptions';

interface XmlWrapperType {
  _getCurrentXmlObj: () => object;
  findNthTag: (tagName: string, index?: number) => XmlWrapperType | undefined;
  findTagArray: (tagName: string) => XmlWrapperType[];
  getAttribute: (attributeName: string) => XmlAttributeReadOptions | undefined;
}

export const XmlWrapper = (xmlObj: object): XmlWrapperType => {
  if (xmlObj === undefined) {
    throw new Error('xmlObj is undefined');
  }
  if (typeof xmlObj !== 'object') {
    throw new Error('xmlObj is not an object, but a ' + typeof xmlObj);
  }

  return {
    _getCurrentXmlObj: () => xmlObj,
    findNthTag: (tagName, index) => findNthTag(xmlObj, tagName, index),
    findTagArray: (tagName) => findTagArray(xmlObj, tagName),
    getAttribute: (attributeName) => getAttribute(xmlObj, attributeName),
  };
};

const findTagArray = (xmlObject: object, name: string) => {
  const tag = findXmlTag(xmlObject, name);

  if (typeof tag !== 'object') {
    return [];
  }
  if (!Array.isArray(tag)) {
    return [XmlWrapper(tag)];
  }

  return tag.map((t) => XmlWrapper(t));
};

const findNthTag = (xmlObject: object, name: string, index = 0) => {
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

const getAttribute = (
  xmlObject: object,
  name: string,
): XmlAttributeReadOptions | undefined => {
  if (!('$' in xmlObject) || typeof xmlObject['$'] !== 'object') {
    return undefined;
  }

  const attributes = xmlObject['$'];

  if (!(name in attributes)) {
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

const findXmlTag = (
  xmlObject: object,
  tagName: string,
): string | object | undefined => {
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const value = xmlObject[key];

      if (typeof value === 'object') {
        const result = findXmlTag(value, tagName);
        if (result !== undefined) return result;
      }
    }
  }

  return undefined;
};
