import { Builder, parseStringPromise, RenderOptions } from 'xml2js';
import { XmlRootDeclaration } from './interfaces/xml-root-declaration.ts';
import { xmlPreProcess } from './xml-processing/xml-pre-process.ts';
import { xmlPostProcess } from './xml-processing/xml-post-process.ts';

/**
 * Parses a text to an XML object
 * @param text
 */
export const parseXml = async (text: string): Promise<XmlRootDeclaration> => {
  const commentsRemoved = removeXmlComments(text);
  const xmlObj = await parseStringPromise(commentsRemoved);

  const rootObj = xmlPreProcess(xmlObj);
  return rootObj;
};

export const toXmlString = (xml: XmlRootDeclaration): string => {
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
  const obj = xmlPostProcess(xml);
  return builder.buildObject(obj);
};

const removeXmlComments = (input: string): string => {
  // Regular expression to match XML comments: <!-- anything -->
  const xmlCommentRegex = /<!--[\s\S]*?-->/g;
  return input.replace(xmlCommentRegex, '');
};
