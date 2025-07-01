// @ts-expect-error it says sharp cannot be imported this way, but it can be?
//                  at least it works
import sharp from 'sharp';

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
    const imgBuffer = Buffer.from(uri, 'base64');
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
