import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const url = process.env.CI_DATA_WAK_URL;
const outputPath = path.resolve('data.wak');

const file = fs.createWriteStream(outputPath);

https
  .get(url, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Download failed: ${response.statusCode}`);
      return;
    }

    response.pipe(file);

    file.on('finish', () => {
      file.close();
      console.log('Download complete.');
    });
  })
  .on('error', (err) => {
    fs.unlink(outputPath, () => {}); // Delete file on error
    console.error('Error downloading the file:', err.message);
  });
