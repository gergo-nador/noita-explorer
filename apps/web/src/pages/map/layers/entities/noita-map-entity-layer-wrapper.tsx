import { useMap } from 'react-leaflet';
import { useMapPane } from '../../hooks/use-map-pane.ts';
import { useThreadsPool } from '../../map-renderer-threads/use-threads-pool.ts';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { zIndexManager } from '../../../../utils/z-index-manager.ts';
import {
  defaultLayerBufferSettings,
  defaultLayerMiscSettings,
  defaultLayerSize,
  defaultLayerZoomSettings,
} from '../default-layer-settings.ts';
import {
  ChunkInfoCollection,
  Map2dOrganizedObject,
} from '../../noita-map.types.ts';
import { EntityLayer } from './entity-layer.ts';
import { ChunkRenderableEntitySprite } from '@noita-explorer/map';

interface Props {
  redrawCounter: number;
  chunkInfos: ChunkInfoCollection;
  foregroundEntities:
    | Map2dOrganizedObject<ChunkRenderableEntitySprite[]>
    | undefined;
}

export const NoitaMapEntityLayerWrapper = ({
  redrawCounter,
  chunkInfos,
  foregroundEntities,
}: Props) => {
  const map = useMap();
  const pane = useMapPane({
    name: 'noita-entity',
    zIndex: zIndexManager.maps.entity,
  });
  const threadsPool = useThreadsPool();
  const layerRef = useRef<L.GridLayer | null>(null);

  useEffect(() => {
    if (!threadsPool?.isLoaded) return;

    if (!layerRef.current) {
      // @ts-expect-error typescript doesn't know we can pass parameters
      const gridLayer = new EntityLayer({
        pane: pane.name,
        ...defaultLayerSize,
        ...defaultLayerZoomSettings,
        ...defaultLayerBufferSettings,
        ...defaultLayerMiscSettings,

        // custom props
        renderPool: threadsPool?.pool,
        chunkInfos,
        foregroundEntities: foregroundEntities ?? {},
      });

      map.addLayer(gridLayer);
      layerRef.current = gridLayer;
    }

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [
    map,
    threadsPool?.pool,
    threadsPool?.isLoaded,
    pane.name,
    foregroundEntities,
    chunkInfos,
  ]);

  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.redraw();
  }, [redrawCounter]);

  return null;
};
