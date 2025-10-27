import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { NoitaBiomeLayer } from './noita-biome-layer.ts';
import {
  NoitaWakBiomes,
  StreamInfoFileFormat,
  WorldPixelSceneFileFormat,
} from '@noita-explorer/model-noita';
// @ts-expect-error threads module is installed
import { Pool } from 'threads';
import { MapRenderType } from '../../../../workers-web/map/map-render.types.ts';

interface Props {
  worldPixelScenes: WorldPixelSceneFileFormat;
  streamInfo: StreamInfoFileFormat;
  biomes: NoitaWakBiomes;
  pool: Pool<MapRenderType>;
}

export const NoitaMapBiomeLayer = ({
  worldPixelScenes,
  streamInfo,
  biomes,
  pool,
}: Props) => {
  const map = useMap();
  const layerRef = useRef<L.GridLayer | null>(null);

  useEffect(() => {
    if (!layerRef.current) {
      // @ts-expect-error typescript doesn't know we can pass parameters
      const gridLayer = new NoitaBiomeLayer({
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
        renderPool: pool,
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
  }, [map]); // Re-run effect if the map instance changes

  // This component does not render any JSX itself.
  return null;
};
