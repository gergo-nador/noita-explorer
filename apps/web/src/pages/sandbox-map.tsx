import { MapContainer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import {
  uncompressNoitaFile,
  readRawChunk,
  renderChunk,
  parseEntitySchema,
  readEntityFile,
  EntitySchema,
} from '@noita-explorer/map';

// Fix for default icon issue with webpack/vite
// This ensures the marker icons are loaded correctly.
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import {
  createFastLzCompressor,
  FastLZCompressor,
} from '@noita-explorer/fastlz';
// src/components/CustomNoitaLayer.tsx
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
  RgbaColor,
  StringKeyDictionary,
  Vector2d,
} from '@noita-explorer/model';
import { NoitaMaterial } from '@noita-explorer/model-noita';
import {
  ChunkEntity,
  ChunkRenderableEntity,
  uncompressNoitaBuffer,
  readEntitySchema,
} from '@noita-explorer/map';
import { FileSystemDirectoryAccessDataWakMemory } from '@noita-explorer/file-systems/data-wak-memory-fs';
import { Buffer } from 'buffer';

const schemaCache: Record<string, Promise<EntitySchema>> = {};

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41], // Half of icon width, full height
});

L.Marker.prototype.options.icon = DefaultIcon;

const dataWakPromise =
  Promise.resolve() ??
  fetch('/data.wak').then(async (res) => {
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return FileSystemDirectoryAccessDataWakMemory(buffer);
  });

export function NoitaMap({
  petriFiles,
  entityFiles,
  materials,
  materialImageCache,
  materialColorCache,
}: {
  petriFiles: FileSystemFileAccess[];
  entityFiles: Record<string, ChunkRenderableEntity[] | undefined>;
  materials: StringKeyDictionary<NoitaMaterial>;
  materialImageCache: StringKeyDictionary<ImageData>;
  materialColorCache: StringKeyDictionary<RgbaColor>;
}) {
  // The Noita world is huge, so you'll adjust this center point later.
  // Using [0, 0] as a starting default.
  const mapCenter: L.LatLngExpression = [0, 0];

  return (
    <MapContainer
      center={mapCenter}
      zoom={3} // Start with a zoom level that shows a good area
      scrollWheelZoom={true}
      style={{ height: '100vh', width: '100%' }} // Important: Map needs a defined size
      crs={L.CRS.Simple} // Use a simple coordinate system for a game map
    >
      {/* HERE is the change! We use our custom layer now.
       */}
      {!__SSG__ && (
        <CustomNoitaLayer
          petriFiles={petriFiles}
          entityFiles={entityFiles}
          materials={materials}
          materialColorCache={materialColorCache}
          materialImageCache={materialImageCache}
        />
      )}

      {/* You can still have other layers like markers on top */}
      <Marker position={[2, 0]}>
        <Popup>Test Marker</Popup>
      </Marker>

      {/* Example marker */}
      <Marker position={[0, 0]}>
        <Popup>
          The Holy Mountain <br /> (This is a test marker)
        </Popup>
      </Marker>
    </MapContainer>
  );
}

/**
 * Extracts two numbers from a string with the format 'world_NUM1_NUM2.png_petri'.
 * Can handle positive and negative numbers.
 *
 * @param {string} inputString The string to extract numbers from.
 * @returns {object|null} An object with the two numbers { num1, num2 } or null if no match is found.
 */
function extractNumbers(inputString: string) {
  // This regular expression looks for the pattern:
  // _(-?\d+)_(-?\d+)
  // - An underscore
  // - (-?\d+): Captures an optional hyphen and one or more digits (the first number)
  // - Another underscore
  // - (-?\d+): Captures an optional hyphen and one or more digits (the second number)
  const regex = /_(-?\d+)_(-?\d+)/;

  // Execute the regex on the input string
  const match = inputString.match(regex);

  // If a match is found, the result is an array.
  // match[0] is the full matched string (e.g., '_-12800_512')
  // match[1] is the first captured group (the first number)
  // match[2] is the second captured group (the second number)
  if (match) {
    const num1 = parseInt(match[1], 10); // Convert string to integer
    const num2 = parseInt(match[2], 10); // Convert string to integer
    return { num1, num2 };
  }

  // If the pattern is not found, return null
  return null;
}

export const NoitaGridLayer = L.GridLayer.extend({
  // The createTile method is the heart of our custom layer.
  // Leaflet calls this for each tile it needs to display.
  createTile: function (coords: L.Coords, done: L.DoneCallback): HTMLElement {
    // 1. Create a container for our tile.
    // We use a div because we will place a canvas inside it.
    const tile = L.DomUtil.create('div', 'leaflet-tile');

    const files: FileSystemFileAccess[] = this.options.petriFiles;
    const currentFile = files.find((file) => {
      const name = file.getName();
      const output = extractNumbers(name);

      if (!output) return;

      const tileX = output.num1 / 512;
      const tileY = output.num2 / 512;

      return tileX === coords.x && tileY === coords.y;
    });

    if (!currentFile) {
      tile.innerHTML = '';
      const div = document.createElement('div');
      div.textContent = 'No tile';
      tile.appendChild(div);
      done(null, tile);
      return tile;
    }

    const output = extractNumbers(currentFile.getName()) ?? {
      num1: 1,
      num2: 2,
    };

    const fastLzCompressorPromise: Promise<FastLZCompressor> =
      this.options.fastLzCompressorPromise;

    fastLzCompressorPromise
      .then((compressor) => uncompressNoitaFile(currentFile, compressor))
      .then((uncompressed) => readRawChunk(uncompressed))
      .then(async (chunk) => {
        /*
        const entityBuffer = findEntityFileForChunk({
          chunkCoords: { x: output.num1 / 512, y: output.num2 / 512 },
          files: this.options.entityFiles,
        });
        const compressor = await fastLzCompressorPromise;
        const entityFileLoaded =
          entityBuffer &&
          (await loadEntityFile({
            buffer: entityBuffer,
            compressor: compressor,
          }));

        const entities =
          entityFileLoaded &&
          (await prepareEntities({
            entities: entityFileLoaded.entities,
            dataWak: await dataWakPromise,
          }));*/
        const fileName = `entities_${2000 * output.num1 + output.num2}.bin`;
        const entities = this.options.entityFiles[fileName];
        console.log('entities', entities);

        const renderedChunk = renderChunk({
          chunk,
          chunkCoordinates: { x: coords.x, y: coords.y },
          materials: this.options.materials,
          materialImageCache: this.options.materialImageCache,
          materialColorCache: this.options.materialColorCache,
          entities: entities || [],
        });

        if (!renderedChunk) {
          done(null, tile);
          tile.appendChild(document.createElement('div'));
          return;
        }

        tile.innerHTML = ''; // Clear the loader
        tile.appendChild(renderedChunk.canvas);

        // 6. Signal to Leaflet that the tile is ready.
        done(null, tile);
      })
      .catch((error) => {
        // Optional: Handle errors, e.g., show an error tile.
        console.error('Failed to decompress and render chunk:', error);
        tile.innerHTML = '';
        const div = document.createElement('div');
        div.textContent = 'Error';
        tile.appendChild(div);

        done(error, tile);
      });

    // 7. IMPORTANT: Return the tile element with the loader immediately.
    // Leaflet will place this on the map while the async operation runs.
    return tile;
  },
});

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

export function CustomNoitaLayer({
  petriFiles,
  entityFiles,
  materials,
  materialImageCache,
  materialColorCache,
}: {
  petriFiles: FileSystemFileAccess[];
  entityFiles: Record<string, ChunkRenderableEntity[] | undefined>;
  materials: StringKeyDictionary<NoitaMaterial>;
  materialImageCache: StringKeyDictionary<ImageData>;
  materialColorCache: StringKeyDictionary<RgbaColor>;
}) {
  const map = useMap();
  const layerRef = useRef<L.GridLayer | null>(null);
  const fastLzCompressor = useRef(createFastLzCompressor());

  useEffect(() => {
    if (!layerRef.current) {
      // Instantiate our custom layer class
      layerRef.current = new NoitaGridLayer({
        tileSize: 512, // Match your chunk size
        minZoom: -4,
        maxZoom: 5, // Adjust as needed

        noWrap: true, // Prevents the map from repeating horizontally

        // --- THE KEY CHANGE IS HERE ---
        // Tell Leaflet that our chunks only exist at zoom level 0.
        minNativeZoom: 0,
        maxNativeZoom: 0,

        // Custom properties
        petriFiles,
        entityFiles,
        materials,
        materialImageCache,
        materialColorCache,
        fastLzCompressorPromise: fastLzCompressor.current,
      });

      // Add the layer to the map
      map.addLayer(layerRef.current);
    }

    // The cleanup function for when the component unmounts
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, petriFiles, materials, materialImageCache, materialColorCache]); // Re-run effect if the map instance changes

  // This component does not render any JSX itself.
  return null;
}

/**
 * Converts a Base64 string to an ImageData object.
 * @param {string} base64String The Base64 string (including the data URI scheme).
 * @returns {Promise<ImageData>} A promise that resolves with the ImageData object.
 */
function base64ToImageData(base64String: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
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

function findEntityFileForChunk({
  chunkCoords,
  files,
}: {
  chunkCoords: Vector2d;
  files: Record<string, Buffer>;
}) {
  const fileName = `entities_${2000 * chunkCoords.y + chunkCoords.x}.bin`;
  return files[fileName];
}

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
