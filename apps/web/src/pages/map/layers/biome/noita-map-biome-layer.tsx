import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { NoitaBiomeLayer } from './noita-biome-layer.ts';
import {
  NoitaWakBiomes,
  StreamInfoFileFormat,
  WorldPixelSceneFileFormat,
} from '@noita-explorer/model-noita';
import { useThreadsPool } from '../../map-renderer-threads/use-threads-pool.ts';
import { useOrganizeBackgroundImages } from '../../hooks/use-organize-background-images.ts';
import { useMapPane } from '../../hooks/use-map-pane.ts';

interface Props {
  worldPixelScenes: WorldPixelSceneFileFormat;
  streamInfo: StreamInfoFileFormat;
  biomes: NoitaWakBiomes;
}

export const NoitaMapBiomeLayer = ({
  worldPixelScenes,
  streamInfo,
  biomes,
}: Props) => {
  const map = useMap();
  const pane = useMapPane({ name: 'noita-biome', zIndex: 1 });
  const threadsPool = useThreadsPool();
  const layerRef = useRef<L.GridLayer | null>(null);
  const { backgrounds, isLoaded: isBackgroundsLoaded } =
    useOrganizeBackgroundImages({ streamInfo });

  useEffect(() => {
    if (!isBackgroundsLoaded) return;

    if (!layerRef.current) {
      // @ts-expect-error typescript doesn't know we can pass parameters
      const gridLayer = new NoitaBiomeLayer({
        pane: pane.name,
        tileSize: 512,
        minZoom: -4,
        maxZoom: 5,

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

      // Add the layer to the map
      map.addLayer(gridLayer);
      layerRef.current = gridLayer;
    }

    // The cleanup function for when the component unmounts
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
    worldPixelScenes,
    backgrounds,
    isBackgroundsLoaded,
    pane.name,
  ]); // Re-run effect if the map instance changes

  // This component does not render any JSX itself.
  return null;
};
