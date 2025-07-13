import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { platformHelpers, stringHelpers } from '@noita-explorer/tools';

const getPathsFromDirectory = (directoryPath: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(`${err.name}: ${err.message} at ${err.stack}`);
        return;
      }

      resolve(files);
    });
  });
};

const checkPathExist = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

const readFileAsBuffer = (filePath: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(`${err.name}: ${err.message} at ${err.stack}`);
        return;
      }

      resolve(data);
    });
  });
};

const readFileAsText = (filePath: string): Promise<string> => {
  return readFileAsBuffer(filePath).then((buffer) => buffer.toString());
};

const writeTextFile = (filePath: string, text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

const readImageAsBase64 = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(`${err.name}: ${err.message} at ${err.stack}`);
        return;
      }

      const parsedPath = path.parse(filePath);
      const extension = stringHelpers.trim({
        text: parsedPath.ext,
        fromStart: '.',
      });

      const mimeType = getMimeTypeFromExtension(extension);

      const base64 = `data:${mimeType};base64,${data.toString('base64')}`;
      resolve(base64);
    });
  });
};

function getMimeTypeFromExtension(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';

  switch (extension) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'bmp':
      return 'image/bmp';
    case 'svg':
      return 'image/svg+xml';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}

const openExplorer = (path: string) => {
  platformHelpers.select({
    windows: () => {
      spawn('explorer', ['/select,', path], {
        stdio: 'ignore',
        detached: true,
      });
    },
    linux: () => {
      spawn('xdg-open', [path], {
        stdio: 'ignore',
        detached: true,
      });
    },
    macOs: () => {
      spawn('open', [path], {
        stdio: 'ignore',
        detached: true,
      });
    },
  });
};

const deleteFile = (path: string) => {
  return new Promise((res) => fs.rm(path, res));
};

export const nodeFileSystemHelpers = {
  getPathsFromDirectory: getPathsFromDirectory,
  checkPathExist: checkPathExist,
  readFileAsBuffer: readFileAsBuffer,
  readFileAsText: readFileAsText,
  writeTextFile: writeTextFile,
  readImageAsBase64: readImageAsBase64,
  openExplorer: openExplorer,
  deleteFile: deleteFile,
};
