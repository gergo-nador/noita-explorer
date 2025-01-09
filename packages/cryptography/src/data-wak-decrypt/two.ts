import fs from 'fs';
import { WakDecryptor } from './WakDecryptor.ts';
import { FiletableEntry } from './WakTypes.ts';
import * as path from 'node:path';

async function main() {
  // Suppose we have a file "test.wak" we want to decrypt
  const wakFileBuffer = fs.readFileSync('data.wak');
  const wakBytes = new Uint8Array(wakFileBuffer);

  // 3) Decrypt and parse the WAK file
  let filetable: FiletableEntry[];
  try {
    filetable = await WakDecryptor.decryptWak(wakBytes);
  } catch (err) {
    console.error(`Error decrypting WAK file`);
    console.error(err);
    process.exit(1);
  }

  console.log(`Wak file decrypted, found ${filetable.length} files`);
  process.stdout.write('Unpacking...   0%');

  const parentPath =
    'C:\\Users\\enbi8\\coding\\noita\\UnWak-master\\UnWak\\bin\\Debug\\netcoreapp3.0\\wak';

  // 4) Write each file to disk
  for (let i = 0; i < filetable.length; i++) {
    const entry = filetable[i];
    // Combine the parent path + the file's relative path

    const outPath = path.join(parentPath, entry.filename);

    try {
      // Create the directory if needed
      fs.mkdirSync(path.dirname(outPath), { recursive: true });

      // Write the file data (slice from wakBuffer)
      const start = entry.file_offset;
      const end = entry.file_offset + entry.file_size;
      const fileData = wakBytes.subarray(start, end);

      await fs.writeFileSync(outPath, fileData, {});
    } catch (err) {
      console.error(`\nFailed to write file: ${outPath}`);
      console.error(err);
      process.exit(1);
    }

    // Update progress every ~1% chunk
    if (
      filetable.length > 100 &&
      i % Math.floor(filetable.length / 100) === 0
    ) {
      const percent = Math.floor((100 * i) / filetable.length)
        .toString()
        .padStart(3, ' ');
      // Erase last 4 chars and rewrite (like \b\b\b\b in C#).
      // Another approach is \r to overwrite the same line in Node:
      process.stdout.write(`\rUnpacking...  ${percent}%`);
    }
  }

  // Finish at 100%
  process.stdout.write(`\rUnpacking...  100%\nDone\n`);

  // Now "wakBytes" is decrypted in-place.
  // The `fileTable` tells us all the offsets, sizes, and filenames.
  //console.log(filetable);
}

main().catch(console.error);
