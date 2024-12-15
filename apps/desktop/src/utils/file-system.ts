import fs from 'fs';
import path from 'node:path';
import { spawn } from 'child_process';
import { Platform } from './Platform';
import { trim } from '@noita-explorer/tools';

export const getFilesFromFolder = (folder: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      if (err) {
        reject(`${err.name}: ${err.message} at ${err.stack}`);
        return;
      }

      resolve(files);
    });
  });
};

export const checkPathExist = (filePath: string): boolean => {
  return fs.existsSync(filePath);
};

export const readFileAsBuffer = (filePath: string): Promise<Buffer> => {
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

export const readFileAsText = (filePath: string): Promise<string> => {
  return readFileAsBuffer(filePath).then((buffer) => buffer.toString());
};

export const writeTextFile = (
  filePath: string,
  text: string,
): Promise<void> => {
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

export const readImageAsBase64 = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(`${err.name}: ${err.message} at ${err.stack}`);
        return;
      }

      const parsedPath = path.parse(filePath);
      const extension = trim({ text: parsedPath.ext, fromStart: '.' });
      const base64 = `data:image/${extension};base64,${data.toString('base64')}`;
      resolve(base64);
    });
  });
};

export const openExplorer = (path: string) => {
  Platform.select({
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
