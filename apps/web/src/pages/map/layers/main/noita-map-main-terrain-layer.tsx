import { RgbaColor, StringKeyDictionary } from '@noita-explorer/model';
import { NoitaMaterial } from '@noita-explorer/model-noita';
import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { createFastLzCompressor } from '@noita-explorer/fastlz';
import { NoitaMainTerrainLayer } from './noita-main-terrain-layer.ts';
import {
  NoitaEntityFileCollection,
  NoitaPetriFileCollection,
} from '../../noita-map.types.ts';

export function NoitaMapMainTerrainLayer({
  petriFiles,
  entityFiles,
  materials,
  materialImageCache,
  materialColorCache,
}: {
  petriFiles: NoitaPetriFileCollection;
  entityFiles: NoitaEntityFileCollection;
  materials: StringKeyDictionary<NoitaMaterial>;
  materialImageCache: StringKeyDictionary<ImageData>;
  materialColorCache: StringKeyDictionary<RgbaColor>;
}) {
  const map = useMap();
  const layerRef = useRef<L.GridLayer | null>(null);
  const fastLzCompressor = useRef(createFastLzCompressor());

  useEffect(() => {
    if (!layerRef.current) {
      // @ts-expect-error typescript doesn't know we can pass parameters
      const gridLayer = new NoitaMainTerrainLayer({
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
        materials,
        materialImageCache,
        materialColorCache,
        fastLzCompressorPromise: fastLzCompressor.current,
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
    map,
    petriFiles,
    entityFiles,
    materials,
    materialImageCache,
    materialColorCache,
  ]); // Re-run effect if the map instance changes

  // This component does not render any JSX itself.
  return null;
}
