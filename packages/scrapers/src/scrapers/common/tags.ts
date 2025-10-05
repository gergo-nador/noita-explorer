import { XmlWrapperType } from '@noita-explorer/tools/xml';

export const splitNoitaEntityTags = (tags: string) => {
  return tags.split(',');
};

export const joinNoitaEntityTags = (tags: string[]) => {
  return tags.join(',');
};

export const hasEntityTag = (xml: XmlWrapperType, tag: string) => {
  const tagString = xml.getAttribute('tags')?.asText() ?? '';
  const tags = splitNoitaEntityTags(tagString);
  return tags.includes(tag);
};
