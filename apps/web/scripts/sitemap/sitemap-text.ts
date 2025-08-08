import '../utils/fake-browser-apis';

import { RouteObject } from 'react-router-dom';
import * as fs from 'fs';
import * as path from 'node:path';

export function generateSitemapPaths(
  routes: RouteObject[],
  prefix?: string,
): string[] {
  let results: string[] = [];

  prefix ??= '';
  const hasSlash = prefix?.endsWith('/');
  if (!hasSlash) {
    prefix += '/';
  }

  for (const route of routes) {
    if (route.path === undefined) {
      continue;
    }

    const subPrefix = prefix + route.path;
    if (route.children) {
      const subResults = generateSitemapPaths(route.children, subPrefix);

      results = results.concat(subResults);
      continue;
    }

    results.push(subPrefix);
  }

  return results;
}

export function generateSitemapFile(urls: string[], outputPath: string) {
  const outputFile = path.resolve(outputPath);
  fs.writeFileSync(outputFile, urls.join('\n'));
}
