import { parseStringPromise, Builder } from 'xml2js';
import { StringKeyDictionaryComposite } from '@noita-explorer/model';

export const parseXml = (
  text: string,
): Promise<StringKeyDictionaryComposite<string>> => {
  return parseStringPromise(text);
};

export const toXml = (obj: object): string => {
  const builder = new Builder();
  return builder.buildObject(obj);
};
