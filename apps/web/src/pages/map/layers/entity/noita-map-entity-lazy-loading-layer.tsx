import { useState, useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { NoitaEntityFileCollection } from '../../noita-map.types.ts';
import { ChunkRenderableEntity } from '@noita-explorer/map';
import { EntityStorageType } from './noita-map-entity-layer.types.ts';
import { fastLzCompressorService } from '../../../../utils/fast-lz-compressor-service.ts';
import { processEntityFile } from '../../utils/process-entity-file.ts';
import { StreamInfoFileFormat } from '@noita-explorer/model-noita';
import { Vector2d } from '@noita-explorer/model';
import { NoitaMapEntityLayer } from './noita-map-entity-layer.tsx';
import { LatLngBounds } from 'leaflet';

interface Props {
  entityFiles: NoitaEntityFileCollection;
  streamInfo: StreamInfoFileFormat;
}

export const NoitaMapEntityLazyLoadingLayer = ({
  entityFiles,
  streamInfo,
}: Props) => {
  const [allEntities, setAllEntities] = useState<EntityStorageType>({});
  const [visibleEntities, setVisibleEntities] = useState<
    ChunkRenderableEntity[]
  >([]);

  const map = useMapEvents({
    moveend: () => setBounds(map.getBounds()),
  });
  const [bounds, setBounds] = useState<LatLngBounds>(map.getBounds());

  useEffect(() => {
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    const minX = southWest.lng;
    const maxX = northEast.lng;
    const minY = northEast.lat;
    const maxY = southWest.lat;

    const minChunkX = Math.floor(minX / 512);
    const maxChunkX = Math.ceil(maxX / 512);
    const minChunkY = Math.ceil(minY / 512);
    const maxChunkY = Math.floor(maxY / 512);

    const newChunkEntities: {
      coords: Vector2d;
      array: ChunkRenderableEntity[];
    }[] = [];
    let visibleEntities: ChunkRenderableEntity[] = [];

    for (let i = minChunkX; i <= maxChunkX; i++) {
      for (let j = minChunkY; j >= maxChunkY; j--) {
        // check if chunk is already loaded
        const chunkEntities = allEntities[i]?.[j];
        if (!chunkEntities) {
          const entityFileNum = 2000 * j + i;
          const entityFile = entityFiles[entityFileNum];
          if (!entityFile) {
            continue;
          }

          const entityArray: ChunkRenderableEntity[] = [];
          newChunkEntities.push({ coords: { x: i, y: j }, array: entityArray });
          fastLzCompressorService
            .get()
            .then((compressor) =>
              processEntityFile({
                entityFile,
                chunkCoords: { x: i, y: j },
                fastLzCompressor: compressor,
                schemaHash: streamInfo.entitySchemaHash,
              }),
            )
            .then((entities) => {
              setAllEntities((prev) => {
                prev[i][j].state = 'loaded';
                for (const entity of entities) {
                  entityArray.push(entity);
                }
                return prev;
              });
            });

          continue;
        }

        if (chunkEntities.state === 'loading') continue;

        const visibleEntitiesInChunk = chunkEntities.entities.filter(
          (e) => e.sprites.length > 0,
        );
        visibleEntities = visibleEntities.concat(visibleEntitiesInChunk);
      }
    }

    if (newChunkEntities.length > 0) {
      setAllEntities((prev) => {
        for (const newChunkEntity of newChunkEntities) {
          if (!(newChunkEntity.coords.x in prev)) {
            prev[newChunkEntity.coords.x] = {};
          }

          prev[newChunkEntity.coords.x][newChunkEntity.coords.y] = {
            state: 'loading',
            entities: newChunkEntity.array,
          };
        }

        return prev;
      });
    }

    setVisibleEntities(visibleEntities);
  }, [bounds, allEntities, entityFiles, streamInfo.entitySchemaHash]);

  const visibleEntities1 = Object.values(allEntities)
    .map((e) => Object.values(e).map((e) => e.entities))
    .flat(2);

  return <NoitaMapEntityLayer entities={visibleEntities1} />;
};
