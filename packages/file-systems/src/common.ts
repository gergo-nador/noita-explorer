export const extractFileNameWithoutExtension = (fileName: string) => {
  const lastIndex = fileName.lastIndexOf('.');
  if (lastIndex === -1) {
    return fileName;
  }

  return fileName.substring(0, lastIndex);
};
