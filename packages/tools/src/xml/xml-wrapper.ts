import {
  addOrModifyAttribute,
  getAttribute,
  getRequiredAttribute,
} from './utils/xml-attribute.ts';
import {
  findAllTagsRecursively,
  findNthTag,
  findTagArray,
} from './utils/xml-finder.ts';
import { addChild, isChild } from './utils/child.ts';
import { toXmlString } from './xml-converter.ts';
import { XmlWrapperType } from './xml-wrapper.type.ts';
import { XmlTagDeclaration } from './interfaces/xml-tag-declaration.ts';
import { XmlRootDeclaration } from './interfaces/xml-root-declaration.ts';

/**
 * Wrapper object providing many utility methods. Provide the parsed xml object
 * containing the root object.
 * @param xmlObj
 * @constructor
 */
export const XmlWrapper = (
  xmlObj: XmlRootDeclaration | XmlTagDeclaration,
): XmlWrapperType => {
  return XmlWrapperInternal({ xmlObj, isRoot: true });
};

const XmlWrapperInternal = ({
  xmlObj,
  isRoot,
}: {
  xmlObj: XmlRootDeclaration | XmlTagDeclaration;
  isRoot: boolean;
}): XmlWrapperType => {
  // extra checks because you never know
  if (xmlObj === undefined) {
    throw new Error('xmlObj is undefined');
  }
  if (typeof xmlObj !== 'object') {
    throw new Error('xmlObj is not an object, but a ' + typeof xmlObj);
  }

  // XmlWrapperType implementation
  const findNthTagInternal = (tagName: string, index: number | undefined) => {
    const tag = findNthTag(xmlObj, tagName, index);
    if (tag) {
      return XmlWrapperInternal({ xmlObj: tag, isRoot: false });
    }
  };

  const findTagArrayInternal = (tagName: string) => {
    const result = findTagArray(xmlObj, tagName);
    return result.map((t) => XmlWrapperInternal({ xmlObj: t, isRoot: false }));
  };

  const findAllTagsInternal = (tagName: string) => {
    const result = findAllTagsRecursively(xmlObj, tagName);
    return result.map((t) => XmlWrapperInternal({ xmlObj: t, isRoot: false }));
  };

  const getAttributeInternal = (attributeName: string) => {
    if (xmlObj.$) {
      return getAttribute(xmlObj as XmlTagDeclaration, attributeName);
    }
  };

  const getRequiredAttributeInternal = (attributeName: string) => {
    if (!xmlObj.$) {
      throw new Error(
        `Could not find attribute ${attributeName} in ${JSON.stringify(xmlObj)}`,
      );
    }

    return getRequiredAttribute(xmlObj as XmlTagDeclaration, attributeName);
  };

  const addOrModifyAttributeInternal = (
    attributeName: string,
    content: string,
  ) => {
    if (!isRoot) {
      addOrModifyAttribute(xmlObj as XmlTagDeclaration, attributeName, content);
    }
  };

  const getTextContentInternal = (): string | undefined => {
    // can only be string or undefined, as a single underscore would be an invalid xml tag
    return xmlObj._ as string | undefined;
  };

  const addChildInternal = (tagName: string): XmlWrapperType => {
    if (isRoot) {
      throw new Error('Cannot add a new child to the root');
    }

    const child = addChild(xmlObj as XmlTagDeclaration, tagName);
    return XmlWrapperInternal({ xmlObj: child, isRoot: false });
  };

  const sortChildrenArrayInternal = (
    tagName: string,
    by: (a: XmlWrapperType, b: XmlWrapperType) => number,
  ) => {
    const items = findTagArray(xmlObj, tagName);
    items.sort((a, b) => {
      const wrapperA = XmlWrapperInternal({ xmlObj: a, isRoot: false });
      const wrapperB = XmlWrapperInternal({ xmlObj: b, isRoot: false });

      return by(wrapperA, wrapperB);
    });
  };

  const getAllChildren = (): Record<string, XmlWrapperType[]> => {
    const result: Record<string, XmlWrapperType[]> = {};

    const childrenKeys = Object.keys(xmlObj).filter((key) => isChild(key));

    for (const key of childrenKeys) {
      const children = xmlObj[key];

      if (Array.isArray(children)) {
        result[key] = children.map((xml) =>
          XmlWrapperInternal({ xmlObj: xml, isRoot: false }),
        );

        continue;
      }

      result[key] = [XmlWrapperInternal({ xmlObj: children, isRoot: false })];
    }

    return result;
  };

  const removeFromNodeTree = () => {
    if (isRoot) {
      throw new Error('The root xml node cannot be removed');
    }

    const xmlObjToRemove = xmlObj as XmlTagDeclaration;
    if (!xmlObjToRemove._parentInfo) {
      return;
    }

    const parent = xmlObjToRemove._parentInfo.parent as
      | XmlTagDeclaration
      | XmlRootDeclaration;
    const childKey = xmlObjToRemove._parentInfo.tagName as string;

    if (!Array.isArray(parent[childKey])) {
      delete parent[childKey];
      delete xmlObj['_parentInfo'];
      return;
    }

    const childArray = parent[childKey];
    const index = childArray.indexOf(xmlObjToRemove);
    if (index === -1) {
      return;
    }

    if (childArray.length === 1) {
      delete parent[childKey];
    } else {
      childArray.splice(index, 1);
    }
    delete xmlObj['_parentInfo'];
  };

  const getAllAttributes = (): Record<string, string> =>
    (xmlObj.$ ?? {}) as Record<string, string>;

  return {
    findNthTag: findNthTagInternal,
    findTagArray: findTagArrayInternal,
    findAllTags: findAllTagsInternal,
    getAttribute: getAttributeInternal,
    getRequiredAttribute: getRequiredAttributeInternal,
    getTextContent: getTextContentInternal,
    getAllChildren: getAllChildren,
    getAllAttributes: getAllAttributes,
    setAttribute: addOrModifyAttributeInternal,
    addChild: addChildInternal,
    sortChildrenArray: sortChildrenArrayInternal,
    remove: removeFromNodeTree,
    toXmlString: () => {
      let toXmlObj = xmlObj;
      if (!isRoot) {
        toXmlObj = { root: toXmlObj } as XmlRootDeclaration;
      }

      return toXmlString(toXmlObj as XmlRootDeclaration);
    },
    _experimental: {
      getCurrentXmlObjReference: () => xmlObj,
    },
  };
};
