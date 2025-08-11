import sharp from 'sharp';
import { WithImplicitCoercion } from 'buffer';
import { base64Helpers } from '@noita-explorer/tools';

export const scaleUpImage = async ({
  base64,
  width,
  height,
}: {
  base64: string;
  width: number;
  height: number;
}) => {
  try {
    base64 = base64Helpers.trimMetadata(base64);
    const imgBuffer = Buffer.from(
      base64 as WithImplicitCoercion<string>,
      'base64',
    );

    const image = await sharp(imgBuffer)
      .resize(width, height, {
        kernel: 'nearest',
        fit: 'fill',
      })
      .png();

    const resultBuffer = await image.toBuffer();
    const base64String = resultBuffer.toString('base64');
    return base64Helpers.appendMetadata(base64String);
  } catch (error) {
    console.error('Error scaling image:', error);
  }
};
