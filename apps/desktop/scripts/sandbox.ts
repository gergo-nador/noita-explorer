import { FileSystemDirectoryAccessNode } from '../src/file-system/file-system-directory-access-node';
import { scrapeExperimental } from '@noita-explorer/scrapers';
import fs from 'fs';
import GIFEncoder from 'gif-encoder-2';
import { loadImage, createCanvas } from 'canvas';
import { imageHelpers, base64Helpers } from '@noita-explorer/tools';

const dataParentFolder = '/Users/gergo.nador/noita-explorer/noita_data';
const folder = FileSystemDirectoryAccessNode(dataParentFolder);

scrapeExperimental
  .scrapeAnimations({
    dataWakParentDirectoryApi: folder,
  })
  .then(async (res) => {
    for (const animation of res.animations) {
      let i = 0;
      for (const image of animation.frameImages) {
        const base64Image = base64Helpers.trimMetadata(image);

        // Convert to binary buffer
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Write to a file
        fs.writeFileSync(
          `/Users/gergo.nador/noita-explorer/noita_data/animations_test/${animation.animation.name}-${i}.png`,
          imageBuffer,
        );
        i++;
      }

      const gifBuffer = await createGif({
        frames: animation.frameImages,
        delay: animation.animation.frameWait,
        repeat: animation.animation.loop,
      });
      fs.writeFileSync(
        `/Users/gergo.nador/noita-explorer/noita_data/animations_gifs/${animation.animation.name}.gif`,
        gifBuffer,
      );
    }
  });

async function createGif({
  frames,
  delay,
  repeat,
}: {
  frames: string[];
  delay: number;
  repeat: boolean;
}) {
  const { width, height } = await imageHelpers.getImageSizeBase64(frames[0]);

  // octree gives more consistent colors for Noita animations
  const algorithm: 'neuquant' | 'octree' = 'octree';
  const useOptimizer = false;
  const totalNumberOfFrames = frames.length;
  const encoder = new GIFEncoder(
    width,
    height,
    algorithm,
    useOptimizer,
    totalNumberOfFrames,
  );
  encoder.setQuality(1);
  encoder.setDelay(delay);
  encoder.setRepeat(repeat ? 0 : undefined);

  encoder.start();

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d', { alpha: true });

  for (const base64 of frames) {
    const img = await loadImage(base64);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#00000000';
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(img, 0, 0, width, height);

    encoder.addFrame(ctx);
  }

  encoder.finish();
  return encoder.out.getData();
}
