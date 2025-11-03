import { useEffect, useRef } from 'react';
import { NoitaBackgroundLayer } from './noita-background-layer.ts';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useMapPane } from '../../hooks/use-map-pane.ts';
import { useThreadsPool } from '../../map-renderer-threads/use-threads-pool.ts';
import { mapConstants } from '@noita-explorer/map';

export const NoitaMapBackgroundLayer = () => {
  const map = useMap();
  const pane = useMapPane({
    name: 'noita-background',
    zIndex: 0,
  });
  const threadsPool = useThreadsPool();
  const layerRef = useRef<L.GridLayer | null>(null);

  useEffect(() => {
    if (!threadsPool?.isLoaded) return;

    if (!layerRef.current) {
      // @ts-expect-error typescript doesn't know we can pass parameters
      const gridLayer = new NoitaBackgroundLayer({
        pane: pane.name,
        tileSize: L.point(
          mapConstants.chunkWidth * 12,
          mapConstants.chunkHeight * 6,
        ),
        minZoom: -5,
        maxZoom: 5,
        keepBuffer: 3,
        edgeBufferTiles: 1,

        noWrap: true,

        minNativeZoom: 0,
        maxNativeZoom: 0,

        // custom props
        renderPool: threadsPool?.pool,
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
  }, [map, pane.name, threadsPool?.pool, threadsPool?.isLoaded]);

  return null;
};
