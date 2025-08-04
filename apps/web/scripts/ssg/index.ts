import '../utils/fake-browser-apis';

import { renderRouteSsg } from '../../dist-lib/app.es';
import * as fs from 'node:fs';

renderRouteSsg('https://localhost:4000/').then((text: string) => {
  fs.writeFileSync('index-ssg.html', text);
  process.exit(0);
});
