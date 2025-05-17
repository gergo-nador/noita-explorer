import { Builder, parseStringPromise, RenderOptions } from 'xml2js';
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
  const renderOpts: RenderOptions = {
    pretty: true,
    // in noita files there are no self-closing XML tags
    // @ts-expect-error allowsEmpty is a valid argument here, the IDE just doesn't recognize it
    allowEmpty: true,
  };

  const builder = new Builder({
    renderOpts: renderOpts,
  });
  return builder.buildObject(obj);
};

const removeXmlComments = (input: string): string => {
  // Regular expression to match XML comments: <!-- anything -->
  const xmlCommentRegex = /<!--[\s\S]*?-->/g;
  return input.replace(xmlCommentRegex, '');
};
