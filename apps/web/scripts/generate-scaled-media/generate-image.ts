import sharp from 'sharp';
import { WithImplicitCoercion } from 'buffer';

export const generateImage = async ({
  base64,
  outputPath,
  width,
  height,
}: {
  base64: string;
  outputPath: string;
  width: number;
  height: number;
}) => {
  try {
    const uri = base64.split(';base64,').pop();
    const imgBuffer = Buffer.from(
      uri as WithImplicitCoercion<string>,
      'base64',
    );
    await sharp(imgBuffer)
      .resize(width, height, {
        kernel: 'nearest',
        fit: 'fill',
      })
      .png()
      .toFile(outputPath);
  } catch (error) {
    console.error('Error scaling image:', error);
  }
};
