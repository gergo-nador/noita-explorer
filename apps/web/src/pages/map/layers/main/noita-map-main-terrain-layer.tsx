import { StreamInfoFileFormat } from '@noita-explorer/model-noita';
import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { NoitaMainTerrainLayer } from './noita-main-terrain-layer.ts';
import {
  NoitaEntityFileCollection,
  NoitaPetriFileCollection,
} from '../../noita-map.types.ts';
import { useThreadsPool } from '../../map-renderer-threads/use-threads-pool.ts';
import { useMapPane } from '../../hooks/use-map-pane.ts';

export function NoitaMapMainTerrainLayer({
  petriFiles,
  entityFiles,
  streamInfo,
}: {
  petriFiles: NoitaPetriFileCollection;
  entityFiles: NoitaEntityFileCollection;
  streamInfo: StreamInfoFileFormat;
}) {
  const map = useMap();
  const pane = useMapPane({ name: 'noita-terrain', zIndex: 2 });
  const layerRef = useRef<L.GridLayer | null>(null);
  const threadsPool = useThreadsPool();

  useEffect(() => {
    if (!layerRef.current) {
      // @ts-expect-error typescript doesn't know we can pass parameters
      const gridLayer = new NoitaMainTerrainLayer({
        pane: pane.name,
        tileSize: 512,
        minZoom: -4,
        maxZoom: 5,

        noWrap: true,

        // --- THE KEY CHANGE IS HERE ---
        minNativeZoom: 0,
        maxNativeZoom: 0,

        // Custom properties
        petriFiles,
        entityFiles,
        streamInfo,
        renderPool: threadsPool?.pool,
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
  }, [map, petriFiles, entityFiles, streamInfo, pane.name, threadsPool?.pool]); // Re-run effect if the map instance changes

  // This component does not render any JSX itself.
  return null;
}
