import { Builder, parseStringPromise } from 'xml2js';
import { StringKeyDictionaryComposite } from '@noita-explorer/model';

/**
 * Parses a text to an XML object
 * @param text
 */
export const parseXml = (
  text: string,
): Promise<StringKeyDictionaryComposite<string>> => {
  const commentsRemoved = removeXmlComments(text);
  return parseStringPromise(commentsRemoved);
};

export const toXml = (obj: object): string => {
  const builder = new Builder();
  return builder.buildObject(obj);
};

const removeXmlComments = (input: string): string => {
  // Regular expression to match XML comments: <!-- anything -->
  const xmlCommentRegex = /<!--[\s\S]*?-->/g;
  return input.replace(xmlCommentRegex, '');
};
