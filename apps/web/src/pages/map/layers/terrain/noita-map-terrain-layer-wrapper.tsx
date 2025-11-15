import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { TerrainLayer } from './terrain-layer.ts';
import {
  Map2dOrganizedObject,
  NoitaPetriFileCollection,
} from '../../noita-map.types.ts';
import { useThreadsPool } from '../../map-renderer-threads/use-threads-pool.ts';
import { useMapPane } from '../../hooks/use-map-pane.ts';
import {
  defaultLayerBufferSettings,
  defaultLayerMiscSettings,
  defaultLayerSize,
  defaultLayerZoomSettings,
} from '../default-layer-settings.ts';
import { ChunkRenderableEntitySprite } from '@noita-explorer/map';
import { zIndexManager } from '../../../../utils/z-index-manager.ts';

interface Props {
  petriFiles: NoitaPetriFileCollection;
  redrawCounter: number;
  backgroundEntities: Map2dOrganizedObject<ChunkRenderableEntitySprite[]>;
}

export function NoitaMapTerrainLayerWrapper({
  petriFiles,
  redrawCounter,
  backgroundEntities,
}: Props) {
  const map = useMap();
  const pane = useMapPane({
    name: 'noita-terrain',
    zIndex: zIndexManager.maps.terrain,
  });
  const layerRef = useRef<L.GridLayer | null>(null);
  const threadsPool = useThreadsPool();

  useEffect(() => {
    if (!threadsPool?.isLoaded) return;

    if (!layerRef.current) {
      // @ts-expect-error typescript doesn't know we can pass parameters
      const gridLayer = new TerrainLayer({
        pane: pane.name,
        ...defaultLayerSize,
        ...defaultLayerZoomSettings,
        ...defaultLayerBufferSettings,
        ...defaultLayerMiscSettings,

        petriFiles,
        renderPool: threadsPool?.pool,
        backgroundEntities,
      });

      // Add the layer to the map
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
    petriFiles,
    pane.name,
    threadsPool?.pool,
    threadsPool?.isLoaded,
    backgroundEntities,
  ]);

  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.redraw();
  }, [redrawCounter]);

  return null;
}
