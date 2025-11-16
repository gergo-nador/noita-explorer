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
import { BackgroundThemes } from './background-themes.ts';
import { zIndexManager } from '../../../../utils/z-index-manager.ts';

interface Props {
  backgroundTheme: BackgroundThemes;
  redrawCounter: number;
}

export const NoitaMapBackgroundLayerWrapper = ({
  backgroundTheme,
  redrawCounter,
}: Props) => {
  const map = useMap();
  const pane = useMapPane({
    name: 'noita-background',
    zIndex: zIndexManager.maps.background,
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
        backgroundTheme,
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

  useEffect(() => {
    if (!layerRef.current) return;

    // @ts-expect-error custom option
    layerRef.current.options.backgroundTheme = backgroundTheme;
    layerRef.current.redraw();
  }, [backgroundTheme, redrawCounter]);

  return null;
};
