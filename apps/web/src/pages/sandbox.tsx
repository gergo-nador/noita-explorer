import { useEffect, useRef, useState } from 'react';
import { getSave00FolderHandle } from '../utils/browser-noita-api/browser-noita-api.ts';
import { FileSystemFileAccess } from '@noita-explorer/model';
import { useSave00Store } from '../stores/save00.ts';
import { useNoitaDataWakStore } from '../stores/noita-data-wak.ts';
import { publicPaths } from '../utils/public-paths.ts';
import { NoitaMap } from './sandbox-map.tsx';

export const Sandbox = () => {
  const { status } = useSave00Store();
  const { data, lookup } = useNoitaDataWakStore();
  const [petriFiles, setFiles] = useState<FileSystemFileAccess[]>([]);
  const [materialImageCache, setMaterialImageCache] =
    useState<Record<string, CanvasRenderingContext2D>>();
  const materialColorCache = useRef({});

  useEffect(() => {
    async function collectImages() {
      if (!data?.materials) return;

      const cache: Record<string, CanvasRenderingContext2D> = {};

      for (const material of data.materials) {
        if (!material.hasGraphicsImage) continue;
        const imagePath = publicPaths.generated.material.image({
          materialId: material.id,
        });
        await new Promise((resolve, reject) => {
          const img = new Image();
          // This is crucial for images from other domains (CORS)
          img.crossOrigin = 'Anonymous';
          img.src = imagePath;

          img.onload = () => {
            // Create an invisible canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            // Set canvas dimensions to match the image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0);
            cache[material.id] = ctx;

            resolve(1);
          };

          img.onerror = () => {
            reject(`Failed to load the image from: ${imagePath}`);
          };
        });
      }

      setMaterialImageCache(cache);
    }
    collectImages();
  }, [data?.materials]);

  useEffect(() => {
    if (status !== 'loaded') return;

    getSave00FolderHandle()
      .then((folder) => folder.getDirectory('world'))
      .then((folder) => folder.listFiles())
      .then((files) =>
        files.filter((file) => file.getName().endsWith('.png_petri')),
      )
      .then((files) =>
        setFiles(files.sort((a, b) => a.getName().localeCompare(b.getName()))),
      );
  }, [status]);

  return (
    <div style={{ width: '100%', height: '90vh', zIndex: 1 }}>
      <div>{status}</div>
      {petriFiles.length > 0 && lookup?.materials && materialImageCache && (
        <NoitaMap
          petriFiles={petriFiles}
          materials={lookup.materials}
          materialImageCache={materialImageCache}
          materialColorCache={materialColorCache.current}
        />
      )}
    </div>
  );
};
