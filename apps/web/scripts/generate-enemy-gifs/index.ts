import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'node:path';
import {
  NoitaScrapedEnemyGif,
  NoitaWakData,
} from '@noita-explorer/model-noita';
import { StringKeyDictionary } from '@noita-explorer/model';
import { base64Helpers } from '@noita-explorer/tools';
import { Buffer } from 'buffer';

dotenv.config();

// only generate in preview and production
const env = process.env.VITE_ENV;
// if set to "generate", it will ignore the environment
const envOverwrite = process.env.GENERATE_ENEMY_GIFS === 'generate';

const isPreviewOrProp = env === 'preview' || env === 'production';

if (envOverwrite) {
  console.log('GENERATE_ENEMY_GIFS found, generating enemy gifs');
} else if (isPreviewOrProp) {
  console.log(`VITE_ENV=${env}, generating enemy gifs`);
} else {
  console.log('Skipping enemy gifs generation');
}

if (envOverwrite || isPreviewOrProp) {
  const noitaEnemyGif = readNoitaEnemyGif();
  if (noitaEnemyGif) {
    generateGifs(noitaEnemyGif);
  }
}

function readNoitaEnemyGif() {
  const noitaEnemyGifPath = 'public/noita_data_gifs.json';

  const noitaEnemyGifExists = fs.existsSync(noitaEnemyGifPath);
  if (!noitaEnemyGifExists) {
    console.error('public/noita_data_gifs.json does not exist');
    return;
  }

  try {
    const enemyGifBuffer = fs.readFileSync(noitaEnemyGifPath);
    const enemyGifString = enemyGifBuffer.toString('utf8');
    const enemyGifJson: StringKeyDictionary<NoitaScrapedEnemyGif> =
      JSON.parse(enemyGifString);

    return enemyGifJson;
  } catch (error) {
    console.error('Error reading or parsing noita_data_gifs.json:', error);
    return null;
  }
}

function generateGifs(gifs: StringKeyDictionary<NoitaScrapedEnemyGif>) {
  const fsPath = 'public/g/enemy-gifs';
  fs.mkdirSync(fsPath, { recursive: true });

  for (const [enemyId, enemyGifCollection] of Object.entries(gifs)) {
    const enemyPath = path.resolve(fsPath, enemyId);
    fs.mkdirSync(enemyPath, { recursive: true });

    for (const gif of enemyGifCollection.gifs) {
      const gifFileName = path.resolve(enemyPath, `${gif.animationId}.gif`);
      const firstFrameFileName = path.resolve(
        enemyPath,
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
