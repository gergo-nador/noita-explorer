import { useEffect, useRef, useState } from 'react';
import { getSave00FolderHandle } from '../utils/browser-noita-api/browser-noita-api.ts';
import { FileSystemFileAccess } from '@noita-explorer/model';
import { useSave00Store } from '../stores/save00.ts';
import { useNoitaDataWakStore } from '../stores/noita-data-wak.ts';
import { publicPaths } from '../utils/public-paths.ts';
import { NoitaMap } from './sandbox-map.tsx';
import {
  uncompressNoitaFile,
  readEntityFile,
  parseEntitySchema,
} from '@noita-explorer/map';
import { createFastLzCompressor } from '@noita-explorer/fastlz';
import { EntitySchema } from '@noita-explorer/map';

const compressorPromise = createFastLzCompressor();

export const Sandbox = () => {
  const { status } = useSave00Store();
  const { data, lookup } = useNoitaDataWakStore();
  const [petriFiles, setPetriFiles] = useState<FileSystemFileAccess[]>([]);
  const [entityFiles, setEntityFiles] = useState<FileSystemFileAccess[]>([]);
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
      .then((files) => {
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
        setEntityFiles(entityFiles);
      });
  }, [status]);

  return (
    <div style={{ width: '100%', height: '90vh', zIndex: 1 }}>
      <div>{status}</div>
      {entityFiles.map((file: FileSystemFileAccess) => (
        <EntityFileExtract file={file} />
      ))}
      {/*entityFiles.length > 0 &&
        entityFiles
          .filter((file, i) => i > 1600 && i < 2000)
          .map((file) => <EntityFileExtract file={file} />)*/}
      {/*entityFiles.length > 0 && <EntityFileExtract file={entityFiles[1670]} />*/}

      {/*petriFiles.length > 0 && lookup?.materials && materialImageCache && (
        <NoitaMap
          petriFiles={petriFiles}
          materials={lookup.materials}
          materialImageCache={materialImageCache}
          materialColorCache={materialColorCache.current}
        />
      )*/}
    </div>
  );
};

const schemaCache: Record<string, Promise<EntitySchema>> = {};

const EntityFileExtract = ({ file }: { file: FileSystemFileAccess }) => {
  const [fileContent, setFileContent] = useState<any>();

  useEffect(() => {
    async function parseSchema(hash: string) {
      if (!(hash in schemaCache)) {
        schemaCache[hash] = fetch(`/schemas/${hash}.xml`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Could not find schema ' + hash);
            }
            return response.text();
          })
          .then((schema) => parseEntitySchema(schema));
      }
      const schema = await schemaCache[hash];
      return schema;
    }

    const load = async () => {
      const compressor = await compressorPromise;
      const buff = await uncompressNoitaFile(file, compressor);

      const entities = await readEntityFile({
        entityBuffer: buff,
        parseSchema: parseSchema,
      });
      setFileContent(entities);
    };

    void load();
  }, []);

  if (!fileContent) {
    return <div>Loading {file.getName()} ...</div>;
  }

  if (fileContent?.entities?.length === 0) {
    return <></>;
  }

  return <div>{JSON.stringify(fileContent)}</div>;
};
