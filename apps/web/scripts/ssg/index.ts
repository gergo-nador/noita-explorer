import '../utils/fake-browser-apis';

import { routes } from '../../dist-lib/routes.es';
import { renderRouteSsg } from '../../dist-lib/ssg.es';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { generateSitemapPaths } from '../sitemap/sitemap-text';
import { stringHelpers } from '@noita-explorer/tools';
import { NoitaWakData } from '@noita-explorer/model-noita';

const wakDataJson = fs.readFileSync('public/noita_wak_data.json').toString()
const wakData:NoitaWakData = JSON.parse(wakDataJson)

generateStaticSites()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

async function generateStaticSites() {
  const urlPaths = generateSitemapPaths(routes);
  for (const urlPath of urlPaths) {
    try {
      const html: string = await renderRouteSsg(urlPath, wakData);

      const fsPath = createFsPathFromWebPath(urlPath);

      const dirPath = path.resolve('dist', ...fsPath.directory);
      fs.mkdirSync(dirPath, { recursive: true });

      const htmlPath = path.resolve(dirPath, fsPath.file);
      fs.writeFileSync(htmlPath, html);
    } catch (ex) {
      console.log('Could not render path ' + urlPath, ex);
    }
  }
}

function createFsPathFromWebPath(webPath: string) {
  webPath = stringHelpers.trim({ text: webPath, fromStart: '/', fromEnd: '/' });
  const split = webPath.split('/');

  if (split.length === 1 && split[0] === '') {
    return { directory: [], file: 'index.html' };
  }

  const fileName = split[split.length - 1];
  const dirPathParts = split.slice(0, split.length - 1);

  return {
    directory: dirPathParts,
    file: fileName + '.html',
  };
}
