import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'node:path';
import { NoitaScrapedGifWrapper } from '@noita-explorer/model-noita';
import { StringKeyDictionary } from '@noita-explorer/model';
import { base64Helpers } from '@noita-explorer/tools';
import { Buffer } from 'buffer';

dotenv.config();

// only generate in preview and production
const env = process.env.VITE_ENV;
// if set to "generate", it will ignore the environment
const envOverwrite = process.env.GENERATE_GIFS === 'generate';

const isPreviewOrProp = env === 'preview' || env === 'production';

if (envOverwrite) {
  console.log('GENERATE_GIFS found, generating gifs');
} else if (isPreviewOrProp) {
  console.log(`VITE_ENV=${env}, generating gifs`);
} else {
  console.log('Skipping gif generation');
}

if (envOverwrite || isPreviewOrProp) {
  const noitaGif = readNoitaGif();
  if (!noitaGif) {
    process.exit(1);
  }

  for (const [key, gifCollection] of Object.entries(noitaGif)) {
    console.log('Generating gifs ' + key);
    generateGifs(key, gifCollection);
  }
}

function readNoitaGif() {
  const noitaGifPath = 'public/noita_data_gifs.json';

  const noitaGifExists = fs.existsSync(noitaGifPath);
  if (!noitaGifExists) {
    console.error('public/noita_data_gifs.json does not exist');
    return;
  }

  try {
    const gifBuffer = fs.readFileSync(noitaGifPath);
    const gifString = gifBuffer.toString('utf8');
    const gifJson: StringKeyDictionary<
      StringKeyDictionary<NoitaScrapedGifWrapper>
    > = JSON.parse(gifString);

    return gifJson;
  } catch (error) {
    console.error('Error reading or parsing noita_data_gifs.json:', error);
    return null;
  }
}

function generateGifs(
  key: string,
  gifs: StringKeyDictionary<NoitaScrapedGifWrapper>,
) {
  const fsPath = 'public/g/' + key;
  fs.mkdirSync(fsPath, { recursive: true });

  for (const [id, gifCollection] of Object.entries(gifs)) {
    const gifPath = path.resolve(fsPath, id);
    fs.mkdirSync(gifPath, { recursive: true });

    for (const gif of gifCollection.gifs) {
      const gifFileName = path.resolve(gifPath, `${gif.animationId}.gif`);
      const firstFrameFileName = path.resolve(
        gifPath,
        `${gif.animationId}-f.png`,
      );

      const gifBuffer = Buffer.from(
        base64Helpers.trimMetadata(gif.buffer),
        'base64',
      );
      fs.writeFileSync(gifFileName, gifBuffer);

      const firstFrameBuffer = Buffer.from(
        base64Helpers.trimMetadata(gif.firstFrame),
        'base64',
      );
      fs.writeFileSync(firstFrameFileName, firstFrameBuffer);
    }
  }
}
