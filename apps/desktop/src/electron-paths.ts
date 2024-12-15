import { app } from 'electron';
import fs from 'fs';

export const electronPaths = {
  appData: app.getPath('userData'),
};

type EnsureFolderResult = 'already_exists' | 'created';
export const ensureFolderCreated = (folderPath: string): EnsureFolderResult => {
  const folderExists = fs.existsSync(folderPath);
  if (folderExists) {
    return 'already_exists';
  }

  fs.mkdirSync(folderPath);
  return 'created';
};

for (const path in electronPaths) {
  try {
    ensureFolderCreated(path);
  } catch (e) {
    console.error('Error while creating path ' + path, e);
  }
}
