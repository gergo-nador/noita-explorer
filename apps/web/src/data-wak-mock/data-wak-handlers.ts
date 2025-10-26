import { http, HttpResponse } from 'msw';
import { noitaDataWakManager } from './noita-data-wak-manager.ts';
import { FileSystemFileAccess } from '@noita-explorer/model';
import { stringHelpers } from '@noita-explorer/tools';

export const dataWakHandlers = [
  http.get('/data-initiate', async () => {
    await noitaDataWakManager.getDataWak();
    return HttpResponse.json({ result: 'done' });
  }),
  http.get('/data/*', async (request) => {
    const dataWak = await noitaDataWakManager.getDataWak();
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
        const arrayBuffer = buffer.buffer;

        return new HttpResponse(arrayBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
          },
        });
      }

      if (urlPath.endsWith('.xml')) {
        const text = await file.read.asText();

        return new HttpResponse(text, {
          status: 200,
          headers: {
            'Content-Type': 'application/xml',
          },
        });
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
