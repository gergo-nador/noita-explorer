export const extractFileNameWithoutExtension = (fileName: string) => {
  const lastIndex = fileName.lastIndexOf('.');
  if (lastIndex === -1) {
    return fileName;
  }

  return fileName.substring(0, lastIndex);
};

export const splitTextToLines = (text: string): string[] => {
  return text.split(/\r\n|\n|\r/);
};
