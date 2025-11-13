import { useThreadsPool } from '../map-renderer-threads/use-threads-pool.ts';
import { useEffect, useState } from 'react';
import { getSave00FolderHandle } from '../../../utils/browser-noita-api/browser-noita-api.ts';
import { MapRendererWorker } from '../map-renderer-threads/threads-pool.types.ts';
import { convertFileToWebTransferable } from '../utils/convertFileToWebTransferable.ts';
import {
  ChunkRenderableEntity,
  ChunkRenderableEntitySprite,
} from '@noita-explorer/map';
import { useCurrentRunService } from '../../../services/current-run/use-current-run-service.ts';
import { noitaSchemaManager } from '../utils/noita-schema-manager.ts';
import { organizeItemsInto2dChunks } from '../utils/organize-items-into-2d-chunks.ts';
import { Map2dOrganizedObject } from '../noita-map.types.ts';

export const useEntityLoader = () => {
  const { isLoaded: isThreadsPoolLoaded, pool } = useThreadsPool();
  const { streamInfo } = useCurrentRunService();
  const [state, setState] = useState<{
    total: number;
    processed: number;
    error?: 'schema-not-found' | 'file-error';
    backgroundEntities?: Map2dOrganizedObject<ChunkRenderableEntitySprite[]>;
    foregroundEntities?: Map2dOrganizedObject<ChunkRenderableEntitySprite[]>;
  }>({
    total: 1,
    processed: 0,
  });

  useEffect(() => {
    if (!isThreadsPoolLoaded || !pool) return;

    getSave00FolderHandle()
      .then((folder) => folder.getDirectory('world'))
      .then((folder) => folder.listFiles())
      .then(async (files) => {
        const schema = await noitaSchemaManager
          .getSchema(streamInfo.entitySchemaHash)
          .catch(() => undefined);

        if (schema === undefined) {
          setState((state) => ({ ...state, error: 'schema-not-found' }));
          return;
        }

        const entityFiles = files.filter(
          (file) =>
            file.getName().startsWith('entities_') &&
            file.getName().endsWith('.bin'),
        );
        setState((state) => ({ ...state, total: entityFiles.length }));

        const allProcessedEntities: ChunkRenderableEntity[][] = [];

        for (const file of entityFiles) {
          const parsedEntities: ChunkRenderableEntity[] = await pool
            .queue(async (worker: MapRendererWorker) => {
              const entityFile = await convertFileToWebTransferable(file);
              return worker.parseEntityFile({ schema }, entityFile);
            })
            .then(
              (
                res: Awaited<ReturnType<MapRendererWorker['parseEntityFile']>>,
              ) => res.entities,
            )
            .catch(() =>
              setState((state) => ({ ...state, error: 'file-error' })),
            );

          allProcessedEntities.push(parsedEntities);
          setState((state) => ({ ...state, processed: state.processed + 1 }));
        }

        const allEntities = allProcessedEntities
          .flat()
          .map((e) => e.sprites)
          .flat()
          .map((e) => ({
            instance: e,
            width: e.size.x,
            height: e.size.y,
            x: e.position.x,
            y: e.position.y,
          }));

        {
          const backgroundEntities = allEntities.filter(
            (e) => e.instance.isBackgroundComponent,
          );
          const organizedFiles = organizeItemsInto2dChunks({
            items: backgroundEntities,
          });
          setState((state) => ({
            ...state,
            backgroundEntities: organizedFiles,
          }));
        }

        {
          const foregroundEntities = allEntities.filter(
            (e) => !e.instance.isBackgroundComponent,
          );
          const organizedFiles = organizeItemsInto2dChunks({
            items: foregroundEntities,
          });
          setState((state) => ({
            ...state,
            foregroundEntities: organizedFiles,
          }));
        }
      });
  }, [isThreadsPoolLoaded, pool, streamInfo.entitySchemaHash]);

  return state;
};
