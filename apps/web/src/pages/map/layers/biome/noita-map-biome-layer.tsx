import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { NoitaBiomeLayer } from './noita-biome-layer.ts';

export const NoitaMapBiomeLayer = () => {
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
