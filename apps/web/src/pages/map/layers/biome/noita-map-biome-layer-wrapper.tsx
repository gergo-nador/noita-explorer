import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BiomeLayer } from './biome-layer.ts';
import {
  NoitaWakBiomes,
  StreamInfoBackground,
  WorldPixelSceneFileFormat,
} from '@noita-explorer/model-noita';
import { useThreadsPool } from '../../map-renderer-threads/use-threads-pool.ts';
import { useMapPane } from '../../hooks/use-map-pane.ts';
import {
  defaultLayerBufferSettings,
  defaultLayerMiscSettings,
  defaultLayerSize,
  defaultLayerZoomSettings,
} from '../default-layer-settings.ts';
import { ChunkInfoCollection } from '../../noita-map.types.ts';

interface Props {
  worldPixelScenes: WorldPixelSceneFileFormat;
  biomes: NoitaWakBiomes;
  backgrounds: Record<number, Record<number, StreamInfoBackground[]>>;
  redrawCounter: number;
  chunkInfos: ChunkInfoCollection;
}

export const NoitaMapBiomeLayerWrapper = ({
  worldPixelScenes,
  biomes,
  backgrounds,
  redrawCounter,
  chunkInfos,
}: Props) => {
  const map = useMap();
  const pane = useMapPane({ name: 'noita-biome', zIndex: 6 });
  const threadsPool = useThreadsPool();
  const layerRef = useRef<L.GridLayer | null>(null);

  useEffect(() => {
    if (!threadsPool?.isLoaded) return;

    if (!layerRef.current) {
      // @ts-expect-error typescript doesn't know we can pass parameters
      const gridLayer = new BiomeLayer({
        pane: pane.name,
        ...defaultLayerSize,
        ...defaultLayerZoomSettings,
        ...defaultLayerBufferSettings,
        ...defaultLayerMiscSettings,

        // custom props
        worldPixelScenes,
        biomes,
        renderPool: threadsPool?.pool,
        backgrounds,
        chunkInfos,
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
    biomes,
    map,
    threadsPool?.pool,
    threadsPool?.isLoaded,
    worldPixelScenes,
    backgrounds,
    pane.name,
    chunkInfos,
  ]);

  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.redraw();
  }, [redrawCounter]);

  return null;
};
