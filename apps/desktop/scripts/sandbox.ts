import { FileSystemDirectoryAccessNode } from '../src/file-system/file-system-directory-access-node';
import { scrapeExperimental } from '@noita-explorer/scrapers';
import fs from 'fs';
import { gifHelpers, base64Helpers } from '@noita-explorer/tools';

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

      const gif = await gifHelpers.createGif({
        frames: animation.frameImages,
        delayMs: animation.animation.frameWait * 1000,
        repeat: animation.animation.loop,
      });
      fs.writeFileSync(
        `/Users/gergo.nador/noita-explorer/noita_data/animations_gifs/${animation.animation.name}.gif`,
        gif.buffer,
      );
    }
  });
