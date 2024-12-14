import { parseStringPromise, Builder } from 'xml2js';

export const parseXml = (text: string): Promise<object> => {
  return parseStringPromise(text);
};

export const toXml = (obj: object): string => {
  const builder = new Builder();
  return builder.buildObject(obj);
};
