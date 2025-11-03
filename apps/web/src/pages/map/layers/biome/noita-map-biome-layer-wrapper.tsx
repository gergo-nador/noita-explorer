import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BiomeLayer } from './biome-layer.ts';
import {
  NoitaWakBiomes,
  StreamInfoBackground,
  StreamInfoFileFormat,
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

interface Props {
  worldPixelScenes: WorldPixelSceneFileFormat;
  streamInfo: StreamInfoFileFormat;
  biomes: NoitaWakBiomes;
  backgrounds: Record<number, Record<number, StreamInfoBackground[]>>;
}

export const NoitaMapBiomeLayerWrapper = ({
  worldPixelScenes,
  streamInfo,
  biomes,
  backgrounds,
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
        streamInfo,
        biomes,
        renderPool: threadsPool?.pool,
        backgrounds,
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
    streamInfo,
    threadsPool?.pool,
    threadsPool?.isLoaded,
    worldPixelScenes,
    backgrounds,
    pane.name,
  ]);

  return null;
};
