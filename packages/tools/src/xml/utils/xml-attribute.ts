import {
  XmlAttributeReadOptions,
  XmlRequiredAttributeReadOptions,
} from '../interfaces/xml-attribute-read-options.ts';
import { XmlTagDeclaration } from '../interfaces/xml-tag-declaration.ts';

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

export const getRequiredAttribute = (
  xmlObject: XmlTagDeclaration,
  name: string,
): XmlRequiredAttributeReadOptions => {
  if (!xmlObject.$) {
    throw new Error(`Could not find attribute ${name}`);
  }

  const attr = getAttribute(xmlObject as XmlTagDeclaration, name);
  if (attr === undefined) {
    throw new Error(`Could not find attribute ${name}`);
  }

  return {
    asInt: () => {
      const result = attr.asInt();
      if (result === undefined) {
        throw new Error('Could not parse int attribute ' + name);
      }
      return result;
    },
    asFloat: () => {
      const result = attr.asFloat();
      if (result === undefined) {
        throw new Error('Could not parse float attribute ' + name);
      }
      return result;
    },
    asBoolean: () => {
      const result = attr.asBoolean();
      return result ?? false;
    },
    asText: () => {
      const result = attr.asText();
      if (result === undefined) {
        throw new Error('Could not bool text attribute ' + name);
      }
      return result;
    },
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
