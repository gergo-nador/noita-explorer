import { useEffect, useRef } from 'react';
import { BackgroundLayer } from './background-layer.ts';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import { useMapPane } from '../../hooks/use-map-pane.ts';
import { useThreadsPool } from '../../map-renderer-threads/use-threads-pool.ts';
import {
  defaultLayerBufferSettings,
  defaultLayerMiscSettings,
  defaultLayerZoomSettings,
} from '../default-layer-settings.ts';
import { backgroundLayerSize } from './background-layer-size.ts';

export const NoitaMapBackgroundLayerWrapper = () => {
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
      const gridLayer = new BackgroundLayer({
        pane: pane.name,
        tileSize: L.point(
          backgroundLayerSize.width,
          backgroundLayerSize.height,
        ),
        ...defaultLayerZoomSettings,
        ...defaultLayerBufferSettings,
        ...defaultLayerMiscSettings,

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
