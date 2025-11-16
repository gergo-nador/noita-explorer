import { useEffect } from 'react';
import { fastLzCompressorService } from '../utils/fast-lz-compressor-service.ts';
import { getSave00FolderHandle } from '../utils/browser-noita-api/browser-noita-api.ts';
import { scrape } from '@noita-explorer/scrapers';

export const Sandbox = () => {
  useEffect(() => {
    Promise.all([fastLzCompressorService.get(), getSave00FolderHandle()]).then(
      async (result) => {
        const areaFiles = await result[1]
          .getDirectory('world')
          .then((folder) => folder.listFiles())
          .then((files) => files.filter((f) => f.getName().startsWith('area')));

        for (const areaFile of areaFiles) {
          const buff = await areaFile.read.asBuffer();
          await scrape.save00.areaFile({
            areaBuffer: buff,
            fastLzCompressor: result[0],
          });
        }
      },
    );
  }, []);

  return <div>Nothing here</div>;
};
