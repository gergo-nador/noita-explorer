import '../utils/fake-browser-apis';

import { routes } from '../../dist-lib/routes.es';
import { stringHelpers } from '@noita-explorer/tools';
import { getDeployUrl } from '../utils/get-deploy-url';
import { generateSitemapFile, generateSitemapPaths } from './sitemap-text';
import { args } from '../utils/process-args';

/**
 * Generate a sitemap.txt file
 *
 * Process arguments:
 * - o: output file of the sitemap
 */

if (!args['o']) {
  console.log('-o output parameter is missing');
  process.exit(1);
}

const paths = generateSitemapPaths(routes);
const baseUrl = getDeployUrl();

const urls = paths.map((path) => {
  path = stringHelpers.trim({ text: path, fromEnd: '/' });
  return baseUrl + path;
});
generateSitemapFile(urls, args['o']);
