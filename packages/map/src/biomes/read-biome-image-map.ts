import { FileSystemFileAccess } from '@noita-explorer/model';
import { imageHelpers } from '@noita-explorer/tools';

interface Props {
  biomeMapFile: FileSystemFileAccess;
}

export async function readBiomeImageMapRaw({ biomeMapFile }: Props) {
  const base64Image = await biomeMapFile.read.asImageBase64();
  const imageData = await imageHelpers.base64ToImageData(base64Image);

  const colors: number[][] = [];
  let currentRow: number[] = [];

  for (let i = 0; i < imageData.width; i++) {
    currentRow = [];

    for (let j = 0; j < imageData.height; j++) {
      const offset = (i * imageData.width + j) * 4;

      const r = imageData.data[offset];
      const g = imageData.data[offset + 1];
      const b = imageData.data[offset + 2];
      const a = imageData.data[offset + 3];

      const argb = (a << 24) | (r << 16) | (g << 8) | b;
      currentRow.push(argb);
    }

    colors.push(currentRow);
  }

  return { colors };
}
