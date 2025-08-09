import '../utils/fake-browser-apis';

import { routes, noitaDataWakStore } from '../../dist-lib/routes.es';
import { getDeployUrl } from '../utils/get-deploy-url';
import { generateSitemapFile, generateSitemapPaths } from './sitemap-text';
import { args } from '../utils/process-args';
import { setDataWak } from '../utils/set-data-wak';

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

setDataWak(noitaDataWakStore);

const paths = generateSitemapPaths(routes);
const baseUrl = getDeployUrl();

const urls = paths.map((path) => baseUrl + path);
generateSitemapFile(urls, args['o']);
