import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { NoitaBiomeLayer } from './noita-biome-layer.ts';
import {
  NoitaWakBiomes,
  StreamInfoBackground,
  StreamInfoFileFormat,
  WorldPixelSceneFileFormat,
} from '@noita-explorer/model-noita';
import { useThreadsPool } from '../../map-renderer-threads/use-threads-pool.ts';
import { useMapPane } from '../../hooks/use-map-pane.ts';

interface Props {
  worldPixelScenes: WorldPixelSceneFileFormat;
  streamInfo: StreamInfoFileFormat;
  biomes: NoitaWakBiomes;
  backgrounds: Record<number, Record<number, StreamInfoBackground[]>>;
}

export const NoitaMapBiomeLayer = ({
  worldPixelScenes,
  streamInfo,
  biomes,
  backgrounds,
}: Props) => {
  const map = useMap();
  const pane = useMapPane({ name: 'noita-biome', zIndex: 1 });
  const threadsPool = useThreadsPool();
  const layerRef = useRef<L.GridLayer | null>(null);

  useEffect(() => {
    if (!threadsPool?.isLoaded) return;

    if (!layerRef.current) {
      // @ts-expect-error typescript doesn't know we can pass parameters
      const gridLayer = new NoitaBiomeLayer({
        pane: pane.name,
        tileSize: 512,
        minZoom: -5,
        maxZoom: 5,
        keepBuffer: 3,
        edgeBufferTiles: 1,

        noWrap: true,

        minNativeZoom: 0,
        maxNativeZoom: 0,

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
