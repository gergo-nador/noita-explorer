import '../utils/fake-browser-apis';

import * as fs from 'fs';
import * as path from 'node:path';
import { NoitaRouteObject } from '../../src/routes/router.types';
import { generatePathsFromRoutes } from '../utils/generate-paths-from-routes';

export function generateSitemapPaths(routes: NoitaRouteObject[]): string[] {
  return generatePathsFromRoutes(routes, {
    filterBy: (route) => route.sitemap !== false,
  }).map((r) => r.path);
}

export function generateSitemapFile(urls: string[], outputPath: string) {
  const outputFile = path.resolve(outputPath);
  fs.writeFileSync(outputFile, urls.join('\n'));
}
