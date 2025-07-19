export const splitNoitaEntityTags = (tags: string) => {
  return tags.split(',');
};

export const joinNoitaEntityTags = (tags: string[]) => {
  return tags.join(',');
};
