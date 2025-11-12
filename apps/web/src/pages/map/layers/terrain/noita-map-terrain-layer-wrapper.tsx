import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { TerrainLayer } from './terrain-layer.ts';
import { NoitaPetriFileCollection } from '../../noita-map.types.ts';
import { useThreadsPool } from '../../map-renderer-threads/use-threads-pool.ts';
import { useMapPane } from '../../hooks/use-map-pane.ts';
import {
  defaultLayerBufferSettings,
  defaultLayerMiscSettings,
  defaultLayerSize,
  defaultLayerZoomSettings,
} from '../default-layer-settings.ts';

interface Props {
  petriFiles: NoitaPetriFileCollection;
  redrawCounter: number;
}

export function NoitaMapTerrainLayerWrapper({
  petriFiles,
  redrawCounter,
}: Props) {
  const map = useMap();
  const pane = useMapPane({ name: 'noita-terrain', zIndex: 7 });
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
  }, [map, petriFiles, pane.name, threadsPool?.pool, threadsPool?.isLoaded]);

  useEffect(() => {
    if (!layerRef.current) return;
    layerRef.current.redraw();
  }, [redrawCounter]);

  return null;
}
