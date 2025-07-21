export type XmlRawRootDeclaration = Record<string, XmlRawTagDeclaration>;

export type XmlRawTagDeclaration = {
  _?: string;
  $?: Record<string, string>;
  _parentInfo?: {
    parent: XmlRawTagDeclaration | XmlRawRootDeclaration;
    tagName: string;
  };
} & {
  [key: string]: (XmlRawTagDeclaration | string)[];
};
