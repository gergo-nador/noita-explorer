import { imageHelpers } from '@noita-explorer/tools';
import { FileSystemFileAccess } from '@noita-explorer/model';

export const scrapeBiomeImageMap = async ({
  biomeMapFile,
}: {
  biomeMapFile: FileSystemFileAccess;
}) => {
  const base64Image = await biomeMapFile.read.asImageBase64();
  const imageData = await imageHelpers.base64ToImageData(base64Image);

  const colors: string[][] = [];
  let currentRow: string[] = [];

  for (let j = 0; j < imageData.height; j++) {
    currentRow = [];
    for (let i = 0; i < imageData.width; i++) {
      const offset = (j * imageData.width + i) * 4;

      const r = imageData.data[offset];
      const g = imageData.data[offset + 1];
      const b = imageData.data[offset + 2];
      const a = imageData.data[offset + 3];

      const argb = (a << 24) | (r << 16) | (g << 8) | b;
      const unsignedArgb = argb >>> 0;

      const colorString = unsignedArgb.toString(16);

      currentRow.push(colorString);
    }

    colors.push(currentRow);
  }

  return { colors, height: imageData.height, width: imageData.width };
};
