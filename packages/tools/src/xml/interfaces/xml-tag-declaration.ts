import { XmlRootDeclaration } from './xml-root-declaration.ts';

export type XmlTagDeclaration = {
  _?: string;
  $?: Record<string, string>;
  _parentInfo?: {
    parent: XmlTagDeclaration | XmlRootDeclaration;
    tagName: string;
  };
} & {
  [key: string]: XmlTagDeclaration[];
};
