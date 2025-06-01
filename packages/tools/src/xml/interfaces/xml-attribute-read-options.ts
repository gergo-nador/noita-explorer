export interface XmlAttributeReadOptions {
  asText: () => string | undefined;
  asInt: () => number | undefined;
  asFloat: () => number | undefined;
  asBoolean: () => boolean | undefined;
}

export interface XmlRequiredAttributeReadOptions {
  asText: () => string;
  asInt: () => number;
  asFloat: () => number;
  asBoolean: () => boolean;
}
