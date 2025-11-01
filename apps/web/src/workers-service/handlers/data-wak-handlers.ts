import { http, HttpResponse } from 'msw';
import { noitaDataWakManager } from '../noita-data-wak-manager.ts';
import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { stringHelpers } from '@noita-explorer/tools';
import { scrape, AnimationInfo } from '@noita-explorer/scrapers';

export const dataWakHandlers = [
  http.get('/data-initiate', async () => {
    await noitaDataWakManager.wait();
    return HttpResponse.json({ result: 'done' });
  }),

  /**
   * Masking the /data/* endpoints, return the files from the data wak directory
   */
  http.get('/data/*', async (request) => {
    let dataWak = noitaDataWakManager.get();
    if (!dataWak) {
      dataWak = await noitaDataWakManager.wait();

      if (!dataWak) {
        throw new Error('Data wak not found');
      }
    }

    const urlText = request.request.url;
    const url = new URL(urlText);
    const urlPath = stringHelpers.trim({ text: url.pathname, fromStart: '/' });

    let file: FileSystemFileAccess;

    try {
      file = await dataWak.getFile(urlPath);
    } catch {
      return new HttpResponse(null, { status: 404 });
    }

    try {
      if (urlPath.endsWith('.png')) {
        const buffer = await file.read.asBuffer();

        return new HttpResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
          },
        });
      }

      const shouldParseSprite = url.searchParams.get('sprite');
      if (urlPath.endsWith('.xml') && !shouldParseSprite) {
        const text = await file.read.asText();

        return new HttpResponse(text, {
          status: 200,
          headers: {
            'Content-Type': 'application/xml',
          },
        });
      }
      if (urlPath.endsWith('.xml') && shouldParseSprite) {
        const result = await parseSprite({
          file,
          dataWakParentDirectoryApi: dataWak,
        });

        const gif = result.gifs[0];
        if (!gif) {
          return new HttpResponse('No gif found', { status: 400 });
        }

        if (shouldParseSprite === 'img') {
          const firstFrame = gif.firstFrame;
          const buffer = base64ToArrayBuffer(firstFrame);

          return new HttpResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': 'image/png',
            },
          });
        }

        if (result.type === 'gif') {
          const gif = result.gifs[0];
          return new HttpResponse(gif.buffer, {
            status: 200,
            headers: {
              'Content-Type': 'image/gif',
            },
          });
        }
      }

      if (urlPath.endsWith('.lua')) {
        const text = await file.read.asText();

        return new HttpResponse(text, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }

      if (urlPath.endsWith('.txt')) {
        const text = await file.read.asText();

        return new HttpResponse(text, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }

      const fileBuffer = await file.read.asBuffer();
      return new HttpResponse(fileBuffer.buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
    } catch (error) {
      return new HttpResponse(JSON.stringify(error), { status: 500 });
    }
  }),
];

const parseSprite = async ({
  dataWakParentDirectoryApi,
  file,
}: {
  file: FileSystemFileAccess;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}) => {
  const animationInfo: AnimationInfo = { id: file.getName(), file };

  const result = await scrape.dataWak.scrapeAnimation({
    dataWakParentDirectoryApi,
    animationInfo,
  });

  return result;
};

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
