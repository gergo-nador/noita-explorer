import { FileSystemDirectoryAccessNode } from '../src/file-system/file-system-directory-access-node';
import { scrapeExperimental } from '@noita-explorer/scrapers';
import fs from 'fs';

const dataParentFolder = '/Users/gergo.nador/noita-explorer/noita_data';
const folder = FileSystemDirectoryAccessNode(dataParentFolder);

scrapeExperimental
  .scrapeAnimations({
    dataWakParentDirectoryApi: folder,
  })
  .then((res) => {
    res.animations.forEach((an) => {
      an.frameImages.forEach((im, i) => {
        const base64Image = im.replace(/^data:image\/\w+;base64,/, '');

        // Convert to binary buffer
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Write to a file
        fs.writeFileSync(
          `/Users/gergo.nador/noita-explorer/noita_data/animations_test/${an.animation.name}-${i}.png`,
          imageBuffer,
        );
      });
    });
  });
