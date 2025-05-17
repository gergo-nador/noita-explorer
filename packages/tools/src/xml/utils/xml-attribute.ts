import { XmlAttributeReadOptions } from '../interfaces/xml-attribute-read-options.ts';
import { XmlTagDeclaration } from '../interfaces/xml-inner-types.ts';

/**
 * Gets an attribute from a XML tag.
 * @param xmlObject
 * @param name
 */
export const getAttribute = (
  xmlObject: XmlTagDeclaration,
  name: string,
): XmlAttributeReadOptions | undefined => {
  if (typeof xmlObject.$ !== 'object') {
    return undefined;
  }

  const attributes = xmlObject.$;

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

export const addOrModifyAttribute = (
  xmlObject: XmlTagDeclaration,
  attributeName: string,
  content: string,
) => {
  if (!xmlObject) {
    return;
  }

  if (typeof xmlObject.$ !== 'object') {
    xmlObject.$ = {};
  }

  xmlObject.$[attributeName] = content;
};
