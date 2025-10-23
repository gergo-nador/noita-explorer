import { publicPaths } from '../../../utils/public-paths.ts';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { useEffect, useState } from 'react';
import { MaterialImageCache } from '../noita-map.types.ts';

export const useCollectMaterialImages = () => {
  const { data } = useNoitaDataWakStore();
  const [materialImageCache, setMaterialImageCache] =
    useState<MaterialImageCache>({});

  useEffect(() => {
    async function collectImages() {
      if (!data?.materials) return;

      const cache: Record<string, ImageData> = {};

      for (const material of data.materials) {
        if (!material.hasGraphicsImage) continue;
        const imagePath = publicPaths.generated.material.image({
          materialId: material.id,
        });
        const imageData: ImageData = await new Promise((resolve, reject) => {
          const img = new Image();
          // This is crucial for images from other domains (CORS)
          img.crossOrigin = 'Anonymous';
          img.src = imagePath;

          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);

            resolve(imageData);
          };

          img.onerror = () => {
            reject(`Failed to load the image from: ${imagePath}`);
          };
        });

        cache[material.id] = imageData;
      }

      setMaterialImageCache(cache);
    }
    collectImages();
  }, [data?.materials]);

  return { materialImageCache };
};
