import { Builder, parseStringPromise, RenderOptions } from 'xml2js';
import {
  XmlRootWrapper,
  XmlTagDeclaration,
} from './interfaces/xml-inner-types.ts';

/**
 * Parses a text to an XML object
 * @param text
 */
export const parseXml = (text: string): Promise<XmlRootWrapper> => {
  const commentsRemoved = removeXmlComments(text);
  return parseStringPromise(commentsRemoved);
};

export const toXmlString = (
  obj: XmlRootWrapper | XmlTagDeclaration,
): string => {
  const renderOpts: RenderOptions = {
    pretty: true,
    // there shouldn't be any self-closing xml tags in noita xml files
    // @ts-expect-error allowsEmpty is a valid argument here, the IDE just doesn't recognize it
    allowEmpty: true,
  };

  const builder = new Builder({
    renderOpts: renderOpts,
    // no xml declaration in noita xml files
    headless: true,
  });
  return builder.buildObject(obj);
};

const removeXmlComments = (input: string): string => {
  // Regular expression to match XML comments: <!-- anything -->
  const xmlCommentRegex = /<!--[\s\S]*?-->/g;
  return input.replace(xmlCommentRegex, '');
};
