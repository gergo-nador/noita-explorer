import {
  XmlAttributeReadOptions,
  XmlRequiredAttributeReadOptions,
} from './interfaces/xml-attribute-read-options.ts';
import { XmlTagDeclaration } from './interfaces/xml-tag-declaration.ts';
import { XmlRootDeclaration } from './interfaces/xml-root-declaration.ts';

export interface XmlWrapperType {
  /**
   * Finds the first tag whose child matches the `tagName`, and gets the
   * nth child (zero indexed) of the type `tagName`
   * @param tagName tag name to look for
   * @param index
   */
  findNthTag: (tagName: string, index?: number) => XmlWrapperType | undefined;
  /**
   * Finds the first tag whose child matches the `tagName`, and get all
   * the children which matches the `tagName`
   * @param tagName
   */
  findTagArray: (tagName: string) => XmlWrapperType[];
  /**
   * Recursively finds all occurrence of a tag that matches the `tagName`
   * @param tagName
   */
  findAllTags: (tagName: string) => XmlWrapperType[];
  /**
   * Gets the specified attribute if exists, otherwise returns undefined
   * @param attributeName
   */
  getAttribute: (attributeName: string) => XmlAttributeReadOptions | undefined;
  /**
   * Gets the specified attribute, throws error if the attribute cannot be found
   * @param attributeName
   */
  getRequiredAttribute: (
    attributeName: string,
  ) => XmlRequiredAttributeReadOptions;
  /**
   * Gets the text content of a tag
   */
  getTextContent: () => string | undefined;
  /**
   * Gets all children elements
   */
  getAllChildren: () => Record<string, XmlWrapperType[]>;
  getAllAttributes: () => Record<string, string>;
  /**
   * Adds a new tag as a child to the current tag
   * @param tagName
   */
  addChild: (tagName: string) => XmlWrapperType;
  /**
   * Adds or modifies an attribute to the specified content
   * @param attributeName
   * @param content
   */
  setAttribute: (attributeName: string, content: string) => void;
  /**
   * Sorts children of the specified tag.
   * @param tagName
   * @param by
   */
  sortChildrenArray: (
    tagName: string,
    by: (a: XmlWrapperType, b: XmlWrapperType) => number,
  ) => void;

  /**
   * Removes the current Xml node from the xml tree
   */
  remove: () => void;

  /**
   * Converts the xml object tree to xml string
   */
  toXmlString(): string;

  _experimental: {
    /**
     * Returns a reference to the current xml object
     */
    getCurrentXmlObjReference: () => XmlRootDeclaration | XmlTagDeclaration;
  };
}
