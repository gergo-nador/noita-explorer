export type XmlRootWrapper = Record<string, XmlTagDeclaration>;

export type XmlTagDeclaration = {
  _?: string;
  $?: Record<string, string>;
} & {
  [key: string]: (XmlTagDeclaration | string)[];
};
