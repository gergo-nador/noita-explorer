import '../utils/dotenv-init';
import * as fs from 'fs';
import { NoitaWakData } from '@noita-explorer/model-noita';
import { Buffer } from 'buffer';
import { generateHtml } from './generate-html';
import { getDeployUrl } from '../utils/get-deploy-url';
import * as path from 'node:path';
import { generateImage } from './generate-image';
import { args } from '../utils/process-args';
import { readDataWak } from '../utils/set-data-wak';

/**
 * Generates scaled up media files of perks, spells, enemies, gifs.
 *
 * Process arguments
 * - -o: output directory. The generated files will be places in {-o}/g/{}/{perks|spells|enemies}/
 */

process.exit(0);

const outputFolder = args['o'];
if (!outputFolder) {
  console.log('output -o argument must be provided');
  process.exit(1);
}

const noitaWakData = readDataWak();
if (noitaWakData) {
  generateStaticAssets(noitaWakData);
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
