import '../utils/fake-browser-apis';

import { getArgumentPath } from '../utils/process-args';
import { renderRawHtmlFile } from './render-raw-html';
import * as fs from 'fs';

/**
 * Generates the default html template with an empty root
 *
 * Arguments:
 * - -o: output file (index.html)
 */

const html = renderRawHtmlFile();

const outputPath = getArgumentPath('o');
fs.writeFileSync(outputPath, html);

process.exit(0);
