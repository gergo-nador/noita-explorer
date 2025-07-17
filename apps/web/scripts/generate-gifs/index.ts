import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'node:path';
import { NoitaScrapedGifWrapper } from '@noita-explorer/model-noita';
import { StringKeyDictionary } from '@noita-explorer/model';
import { base64Helpers } from '@noita-explorer/tools';
import { Buffer } from 'buffer';
// @ts-expect-error no esModuleInterop error pls, it works
import minimist from 'minimist';
// @ts-expect-error no esModuleInterop error pls, it works
import process from 'node:process';

/**
 * Generate gifs from the scraped data.wak content.
 *
 * Process arguments:
 * - --gif-data: the json file which contains the base64 encoded gifs and first frames
 * - -o: output folder for the gifs. The gifs will be placed under {-o}/g/{main_key}/{animation_id}/{gif_name}.gif
 */

dotenv.config();

const argv: Record<string, string> = minimist(process.argv.slice(2));

const dataGifJsonPath = argv['gif-data'];
if (!dataGifJsonPath) {
  console.log(
    '--gif-data argument must point to the noita_data_gifs.json file',
  );
  process.exit(1);
}

const outputFolder = argv['o'];
if (!outputFolder) {
  console.log('output -o argument must be provided');
  process.exit(1);
}

const noitaGif = readNoitaGif();
if (!noitaGif) {
  process.exit(1);
}

for (const [key, gifCollection] of Object.entries(noitaGif)) {
  console.log('Generating gifs ' + key);
  generateGifs(key, gifCollection);
}

function readNoitaGif() {
  const noitaGifPath = dataGifJsonPath;

  const noitaGifExists = fs.existsSync(noitaGifPath);
  if (!noitaGifExists) {
    console.error(noitaGifPath + ' does not exist');
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
  const fsPath = path.resolve(outputFolder, 'g', key);
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
