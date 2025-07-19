import { FileSystemDirectoryAccessNode } from '@noita-explorer/file-systems';
import { mergeXmlBaseFiles } from './datawak/scrape-enemies/merge-xml-base-files.ts';
import { diffChars } from 'diff';

const folder = FileSystemDirectoryAccessNode(
  '/Users/gergo.nador/noita-explorer/noita_data',
);
const pathHumanoid = 'data/entities/base_humanoid.xml';
const pathBase = 'data/entities/base_enemy_basic.xml';
const pathZombie = 'data/entities/animals/zombie.xml';
const pathZombieWeak = 'data/entities/animals/zombie_weak.xml';

async function getXml(path: string) {
  const file = await folder.getFile(path);
  const xml = await mergeXmlBaseFiles({
    file: file,
    dataWakParentDirectoryApi: folder,
  });

  return xml.toXmlString();
}

async function diffText(text1: string, text2: string) {
  const diff = diffChars(text1, text2);
  const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m', // Removed
    green: '\x1b[32m', // Added
    gray: '\x1b[90m', // Unchanged
  };

  diff.forEach((part) => {
    if (part.added) {
      process.stdout.write(colors.green + part.value + colors.reset);
    } else if (part.removed) {
      process.stdout.write(colors.red + part.value + colors.reset);
    } else {
      process.stdout.write(colors.gray + part.value + colors.reset);
    }
  });
}

async function sandbox() {
  const xml = await Promise.all([
    getXml(pathHumanoid),
    getXml(pathBase),
    getXml(pathZombie),
    getXml(pathZombieWeak),
  ]);

  console.log('---------------------------------------------------');
  console.log('Humanoid -> Base Enemy');
  console.log('---------------------------------------------------');
  await diffText(xml[0], xml[1]);

  console.log('\n');
  console.log('---------------------------------------------------');
  console.log('Base Enemy -> Zombie');
  console.log('---------------------------------------------------');
  await diffText(xml[1], xml[2]);

  console.log('\n');
  console.log('---------------------------------------------------');
  console.log('Zombie -> Zombie Weak');
  console.log('---------------------------------------------------');
  await diffText(xml[2], xml[3]);
}

sandbox();
