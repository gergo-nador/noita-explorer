import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { Buffer } from 'buffer';
import { FastLZCompressor } from '@noita-explorer/fastlz';
import {
  ChunkEntity,
  ChunkRenderableEntity,
  EntitySchema,
  parseEntitySchema,
  readEntityFile,
  readEntitySchema,
  uncompressNoitaBuffer,
} from '@noita-explorer/map';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems/data-wak-memory-fs';

const schemaCache: Record<string, Promise<EntitySchema>> = {};
const dataWakPromise = fetch('/data.wak').then(async (res) => {
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return FileSystemDirectoryAccessDataWakMemory(buffer);
});

export const Sandbox = () => {
  return <div>Nothing here</div>;
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
    const physicsImageShapeComponent = entity.components.find(
      (component) => component.name === 'PhysicsImageShapeComponent',
    );
    if (physicsImageShapeComponent) {
      const imageFile = physicsImageShapeComponent.data['image_file'];
    }

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
