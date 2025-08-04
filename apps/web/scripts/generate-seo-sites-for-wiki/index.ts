import '../utils/dotenv-init';
import * as fs from 'fs';
import { NoitaWakData } from '@noita-explorer/model-noita';
import { Buffer } from 'buffer';
import { generateHtml } from './generate-html';
import { getDeployUrl } from '../utils/get-deploy-url';
import * as path from 'node:path';
import { generateImage } from './generate-image';
import { args } from '../utils/process-args';

/**
 * Generates search engine optimized html files for perks,
 * spells and enemies. Scaled up version of the images associated
 * with the objects are also generated and linked in the html files
 *
 * Process arguments
 * - --wak-data: path to the noita_data_wak.json file
 * - -o: output directory. The generated files will be places in {-o}/g/wiki/{perks|spells|enemies}/
 */

const dataWakJsonPath = args['wak-data'];
if (!dataWakJsonPath) {
  console.log('--wak-data argument must point to the noita_wak_data.json file');
  process.exit(1);
}

const outputFolder = args['o'];
if (!outputFolder) {
  console.log('output -o argument must be provided');
  process.exit(1);
}

const noitaWakData = readNoitaWakData();
if (noitaWakData) {
  generateStaticAssets(noitaWakData);
}

function readNoitaWakData() {
  const noitaWakDataPath = dataWakJsonPath;

  const noitaWakDataExists = fs.existsSync(noitaWakDataPath);
  if (!noitaWakDataExists) {
    console.log('noita data wak file does not exist');
    return;
  }

  try {
    const wakDataBuffer = fs.readFileSync(noitaWakDataPath);
    const wakDataString = wakDataBuffer.toString('utf8');
    const wakDataJson: NoitaWakData = JSON.parse(wakDataString);

    return wakDataJson;
  } catch (error) {
    console.error('Error reading or parsing noita_wak_data.json:', error);
    return null;
  }
}

async function generateStaticAssets(data: NoitaWakData) {
  const fsPath = path.resolve(outputFolder, 'g', 'wiki');
  const deployUrl = getDeployUrl();
  const webPath = deployUrl + '/g/wiki';
  fs.mkdirSync(fsPath, { recursive: true });

  // perks
  {
    const perksFolderPath = fsPath + '/perks';
    const perksPublicImagePath = webPath + '/perks';
    fs.mkdirSync(perksFolderPath, { recursive: true });

    for (const perk of data.perks) {
      const redirectUrl = `/wiki/perks?perk=${perk.id}`;
      const imageWebPath = `${perksPublicImagePath}/${perk.id}.png`;
      const imagePath = `${perksFolderPath}/${perk.id}.png`;
      const imagePathFs = path.resolve(imagePath);

      const width = 1500;
      const height = 1500;

      if (!fs.existsSync(imagePathFs)) {
        await generateImage({
          base64: perk.imageBase64,
          outputPath: imagePathFs,
          width: width,
          height: height,
        });
      }

      const html = generateHtml({
        siteName: 'Noita Explorer',
        title: perk.name,
        description: perk.description,
        url: deployUrl + redirectUrl,
        image: {
          url: imageWebPath,
          mimeType: 'image/png',
          width: width.toString(),
          height: height.toString(),
          alt: perk.name,
        },

        redirectUrl: redirectUrl,
      });

      const buffer = Buffer.from(html);
      fs.writeFileSync(`${perksFolderPath}/${perk.id}.html`, buffer);
    }
    console.log('Static assets generated - Perks');
  }

  // spells
  {
    const spellsFolderPath = fsPath + '/spells';
    const spellsPublicImagePath = webPath + '/spells';
    fs.mkdirSync(spellsFolderPath, { recursive: true });

    for (const spell of data.spells) {
      const redirectUrl = `/wiki/spells?spell=${spell.id}`;
      const imageWebPath = `${spellsPublicImagePath}/${spell.id}.png`;
      const imagePath = `${spellsFolderPath}/${spell.id}.png`;
      const imagePathFs = path.resolve(imagePath);

      const width = 1500;
      const height = 1500;

      if (!fs.existsSync(imagePathFs)) {
        await generateImage({
          base64: spell.imageBase64,
          outputPath: imagePathFs,
          width: width,
          height: height,
        });
      }

      const html = generateHtml({
        siteName: 'Noita Explorer',
        title: spell.name,
        description: spell.description,
        url: deployUrl + redirectUrl,
        image: {
          url: imageWebPath,
          mimeType: 'image/png',
          width: width.toString(),
          height: height.toString(),
          alt: spell.name,
        },

        redirectUrl: redirectUrl,
      });

      const buffer = Buffer.from(html);
      fs.writeFileSync(`${spellsFolderPath}/${spell.id}.html`, buffer);
    }
    console.log('Static assets generated - Spells');
  }

  // enemies
  {
    const enemiesFolderPath = fsPath + '/enemies';
    const enemiesPublicImagePath = webPath + '/enemies';
    fs.mkdirSync(enemiesFolderPath, { recursive: true });

    for (const enemy of data.enemies) {
      const redirectUrl = `/wiki/enemies?enemy=${enemy.id}`;
      const imageWebPath = `${enemiesPublicImagePath}/${enemy.id}.png`;
      const imagePath = `${enemiesFolderPath}/${enemy.id}.png`;
      const imagePathFs = path.resolve(imagePath);

      const width = 1500;
      const height = 1500;

      if (!fs.existsSync(imagePathFs)) {
        await generateImage({
          base64: enemy.imageBase64,
          outputPath: imagePathFs,
          width: width,
          height: height,
        });
      }

      const html = generateHtml({
        siteName: 'Noita Explorer',
        title: enemy.name,
        description: `${enemy.hp}❤️ ${enemy.hasGoldDrop ? enemy.goldDrop : '-'}💰`,
        url: deployUrl + redirectUrl,
        image: {
          url: imageWebPath,
          mimeType: 'image/png',
          width: width.toString(),
          height: height.toString(),
          alt: enemy.name,
        },

        redirectUrl: redirectUrl,
      });

      const buffer = Buffer.from(html);
      fs.writeFileSync(`${enemiesFolderPath}/${enemy.id}.html`, buffer);
    }
    console.log('Static assets generated - Enemies');
  }
}
