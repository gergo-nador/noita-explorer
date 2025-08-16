import '../utils/dotenv-init';
import * as fs from 'fs';
import * as path from 'node:path';
import { StringKeyDictionary } from '@noita-explorer/model';
import { base64Helpers } from '@noita-explorer/tools';
import { Buffer } from 'buffer';
import * as process from 'node:process';
import {
  NoitaScrapedMedia,
  NoitaScrapedMediaGif,
  NoitaScrapedMediaImage,
} from '@noita-explorer/model-noita';
import { args } from '../utils/process-args';

/**
 * Generate media from the scraped data.wak content.
 *
 * Process arguments:
 * - --media-data: the json file which contains the base64 encoded media data
 * - -o: output folder for the media files. The media files will be placed under {-o}/g/{main_key}/{object_id}/
 */

const dataMediaJsonPath = args['media-data'];
if (!dataMediaJsonPath) {
  console.log(
    '--media-data argument must point to the noita_data_media.json file',
  );
  process.exit(1);
}

const outputFolder = args['o'];
if (!outputFolder) {
  console.log('output -o argument must be provided');
  process.exit(1);
}

const noitaMedia = readNoitaMedia();
if (!noitaMedia) {
  console.error(dataMediaJsonPath + ' does not exist');
  process.exit(1);
}

for (const [key, mediaCollection] of Object.entries(noitaMedia)) {
  console.log('Generating media ' + key);
  generateMedia(key, mediaCollection);
}

function readNoitaMedia():
  | StringKeyDictionary<StringKeyDictionary<NoitaScrapedMedia[]>>
  | undefined {
  const noitaGifPath = dataMediaJsonPath;

  const noitaGifExists = fs.existsSync(noitaGifPath);
  if (!noitaGifExists) {
    console.error(noitaGifPath + ' does not exist');
    return;
  }

  try {
    const gifBuffer = fs.readFileSync(noitaGifPath);
    const gifString = gifBuffer.toString('utf8');
    // orb-gifs and enemy-gifs form the top level StringKeyDict
    const gifJson: StringKeyDictionary<
      StringKeyDictionary<NoitaScrapedMedia[]>
    > = JSON.parse(gifString);

    return gifJson;
  } catch (error) {
    console.error('Error reading or parsing noita_data_gifs.json:', error);
    return undefined;
  }
}

function generateMedia(
  key: string,
  mediaDict: StringKeyDictionary<NoitaScrapedMedia[]>,
) {
  const fsPath = path.resolve(outputFolder, 'g', key);
  fs.mkdirSync(fsPath, { recursive: true });

  for (const [id, mediaArr] of Object.entries(mediaDict)) {
    if (mediaArr.length === 0) {
      continue;
    }

    const mediaPath = path.resolve(fsPath, id);
    fs.mkdirSync(mediaPath, { recursive: true });

    for (const media of mediaArr)
      if (media.type === 'image') {
        generateImage({ fsPath: mediaPath, media: media });
      } else if (media.type === 'gif') {
        generateGifs({ fsPath: mediaPath, media: media });
      }
  }
}

function generateImage({
  fsPath,
  media,
}: {
  fsPath: string;
  media: NoitaScrapedMediaImage;
}) {
  const imagesPath = path.resolve(fsPath, 'images');
  fs.mkdirSync(imagesPath, { recursive: true });

  const imageFilePath = path.resolve(imagesPath, media.name + '.png');
  const base64 = base64Helpers.trimMetadata(media.imageBase64);
  const buffer = Buffer.from(base64, 'base64');
  fs.writeFileSync(imageFilePath, buffer);
}

function generateGifs({
  fsPath,
  media,
}: {
  fsPath: string;
  media: NoitaScrapedMediaGif;
}) {
  const gifPath = path.resolve(fsPath, 'gifs');
  fs.mkdirSync(gifPath, { recursive: true });

  for (const gif of media.gifs) {
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
