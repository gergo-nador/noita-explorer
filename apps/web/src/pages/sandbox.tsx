import { useEffect, useRef, useState } from 'react';
import { getSave00FolderHandle } from '../utils/browser-noita-api/browser-noita-api.ts';
import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import { useSave00Store } from '../stores/save00.ts';
import { useNoitaDataWakStore } from '../stores/noita-data-wak.ts';
import { publicPaths } from '../utils/public-paths.ts';
import { NoitaMap } from './sandbox-map.tsx';
import { Buffer } from 'buffer';
import {
  createFastLzCompressor,
  FastLZCompressor,
} from '@noita-explorer/fastlz';
import {
  ChunkEntity,
  ChunkRenderableEntity,
  EntitySchema,
  parseEntitySchema,
  readEntityFile,
  readEntitySchema,
  uncompressNoitaBuffer,
} from '@noita-explorer/map';
import { base64Helpers } from '@noita-explorer/tools';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems/data-wak-memory-fs';

const schemaCache: Record<string, Promise<EntitySchema>> = {};
const dataWakPromise = fetch('/data.wak').then(async (res) => {
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return FileSystemDirectoryAccessDataWakMemory(buffer);
});

export const Sandbox = () => {
  const { status } = useSave00Store();
  const { data, lookup } = useNoitaDataWakStore();
  const [petriFiles, setPetriFiles] = useState<FileSystemFileAccess[]>([]);
  const [entityFiles, setEntityFiles] = useState<
    Record<string, ChunkRenderableEntity[] | undefined>
  >({});
  const [materialImageCache, setMaterialImageCache] =
    useState<Record<string, ImageData>>();
  const materialColorCache = useRef({});

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

  useEffect(() => {
    if (status !== 'loaded') return;

    getSave00FolderHandle()
      .then((folder) => folder.getDirectory('world'))
      .then((folder) => folder.listFiles())
      .then(async (files) => {
        const petriFiles = files
          .filter((file) => file.getName().endsWith('.png_petri'))
          .sort((a, b) => a.getName().localeCompare(b.getName()));
        setPetriFiles(petriFiles);

        const entityFiles = files
          .filter(
            (file) =>
              file.getName().startsWith('entities_') &&
              file.getName().endsWith('.bin'),
          )
          .sort((a, b) => a.getName().localeCompare(b.getName()));

        const fastLzCompressor = await createFastLzCompressor();
        const entityFileBuffers: Record<string, Buffer> = {};
        for (const entityFile of entityFiles) {
          const uint8Array = await entityFile.read.asBuffer();
          const entityBuffer = Buffer.from(uint8Array.buffer);

          const entityFileLoaded = await loadEntityFile({
            buffer: entityBuffer,
            compressor: fastLzCompressor,
          });

          const entities =
            entityFileLoaded &&
            (await prepareEntities({
              entities: entityFileLoaded.entities,
              dataWak: await dataWakPromise,
            }));

          debugger;
          entityFileBuffers[entityFile.getName()] = entities;
        }

        setEntityFiles(entityFileBuffers);
      });
  }, [status]);

  return (
    <div style={{ width: '100%', height: '90vh', zIndex: 1 }}>
      <div>{status}</div>

      {petriFiles.length > 0 &&
        Object.keys(entityFiles).length > 0 &&
        lookup?.materials &&
        materialImageCache && (
          <NoitaMap
            petriFiles={petriFiles}
            entityFiles={entityFiles}
            materials={lookup.materials}
            materialImageCache={materialImageCache}
            materialColorCache={materialColorCache.current}
          />
        )}
    </div>
  );
};

const loadEntityFile = async ({
  compressor,
  buffer,
}: {
  compressor: FastLZCompressor;
  buffer: Buffer;
}) => {
  try {
    const buff = await uncompressNoitaBuffer(buffer, compressor);

    const schemaHash = await readEntitySchema({ entityBuffer: buff });
    const schema = await parseSchema(schemaHash.schemaFile);

    const entities = await readEntityFile({
      entityBuffer: buff,
      schema: schema,
    });

    return entities;
  } catch (e) {
    console.error(e);
  }
};
async function parseSchema(hash: string) {
  if (!(hash in schemaCache)) {
    // @ts-expect-error svsrvvtsrv rsvsrtb
    schemaCache[hash] = fetch(`/schemas/${hash}.xml`)
      .then((response) => {
        if (!response.ok) {
          console.log('schema not ok', response);
          throw new Error('Could not find schema ' + hash);
        }
        return response.text();
      })
      .then((schema) => {
        return parseEntitySchema(schema);
      })
      .catch((error) => console.log('schema parse not ok', error));
  }
  const promise = schemaCache[hash];
  const schema = await promise;
  return schema;
}

async function prepareEntities({
  entities,
  dataWak,
}: {
  entities: ChunkEntity[];
  dataWak: FileSystemDirectoryAccess;
}): Promise<ChunkRenderableEntity[]> {
  const renderableEntities: ChunkRenderableEntity[] = [];

  for (const entity of entities) {
    const imgFile = await dataWak.getFile(entity.fileName);
    const imageBase64 = await imgFile.read.asImageBase64();
    const imageData = await base64ToImageData(imageBase64);

    const renderableEntity: ChunkRenderableEntity = {
      name: entity.name,
      lifetimePhase: entity.lifetimePhase,
      scale: entity.scale,
      position: entity.position,
      rotation: entity.rotation,
      tags: entity.tags,
      imageData: imageData,
    };

    renderableEntities.push(renderableEntity);
  }

  return renderableEntities;
}

/**
 * Converts a Base64 string to an ImageData object.
 * @param {string} base64String The Base64 string (including the data URI scheme).
 * @returns {Promise<ImageData>} A promise that resolves with the ImageData object.
 */
function base64ToImageData(base64String: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    debugger;
    // 1. Create a new Image object
    const img = new Image();

    // 2. Set up event listeners for loading and errors
    img.onload = () => {
      // 3. Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx == null) {
        reject('No Canvas2dContext available');
        return;
      }

      // 4. Set canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // 5. Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // 6. Get the ImageData from the canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Resolve the promise with the ImageData
      resolve(imageData);
    };

    img.onerror = (error) => {
      reject(error);
    };

    // 7. Set the image source to the Base64 string to trigger loading
    img.src = base64String;
  });
}
