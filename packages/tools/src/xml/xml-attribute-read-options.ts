export interface XmlAttributeReadOptions {
  asText: () => string | undefined;
  asInt: () => number | undefined;
  asFloat: () => number | undefined;
  asBoolean: () => boolean | undefined;
}
