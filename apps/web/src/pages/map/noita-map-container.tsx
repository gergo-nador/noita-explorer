import {
  NoitaWakBiomes,
  StreamInfoBackground,
} from '@noita-explorer/model-noita';
import L from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { NoitaMapTerrainLayerWrapper } from './layers/terrain/noita-map-terrain-layer-wrapper.tsx';
import { NoitaMapBiomeLayerWrapper } from './layers/biome/noita-map-biome-layer-wrapper.tsx';
import { NoitaMapEntityLazyLoadingLayer } from './layers/entity/noita-map-entity-lazy-loading-layer.tsx';
import { ThreadsPoolContextProvider } from './map-renderer-threads/threads-pool-context-provider.tsx';
import { NoitaMapBackgroundLayerWrapper } from './layers/background/noita-map-background-layer-wrapper.tsx';
import { Buffer } from 'buffer';
import { MapUtilityPanel } from './components/map-utility-panel.tsx';
import { useRef, useState } from 'react';
import { MapRef } from 'react-leaflet/MapContainer';
import { BackgroundThemes } from './layers/background/background-themes.ts';
import { useCurrentRunService } from '../../services/current-run/use-current-run-service.ts';
import {
  ChunkInfoCollection,
  MapBounds,
  NoitaEntityFileCollection,
  NoitaPetriFileCollection,
} from './noita-map.types.ts';

interface Props {
  biomes: NoitaWakBiomes;
  backgrounds: Record<number, Record<number, StreamInfoBackground[]>>;
  dataWakBuffer: Buffer;
  petriFileCollection: NoitaPetriFileCollection;
  entityFileCollection: NoitaEntityFileCollection;
  mapBounds: MapBounds;
  chunkInfos: ChunkInfoCollection;
}

export function NoitaMapContainer({
  biomes,
  backgrounds,
  dataWakBuffer,
  petriFileCollection,
  entityFileCollection,
  mapBounds,
  chunkInfos,
}: Props) {
  const { worldPixelScenes, streamInfo } = useCurrentRunService();
  const [forceRedrawCounter, setForceRedrawCounter] = useState(0);
  const mapRef = useRef<MapRef>(null);
  const mapCenter: L.LatLngExpression = [0, 0];

  const [backgroundTheme, setBackgroundTheme] =
    useState<BackgroundThemes>('dayMid');

  const mapBoundsPadding = 4 * 512;

  return (
    <ThreadsPoolContextProvider dataWakBuffer={dataWakBuffer}>
      <MapContainer
        center={mapCenter}
        zoom={2}
        scrollWheelZoom={true}
        style={{ height: '80vh', width: '100%' }}
        crs={L.CRS.Simple}
        maxBounds={[
          [
            -mapBounds.maxY - mapBoundsPadding,
            mapBounds.minX - mapBoundsPadding,
          ],
          [
            -mapBounds.minY + mapBoundsPadding,
            mapBounds.maxX + mapBoundsPadding,
          ],
        ]}
        maxBoundsViscosity={0.5}
        ref={mapRef}
      >
        {!__SSG__ && (
          <>
            <NoitaMapBackgroundLayerWrapper
              backgroundTheme={backgroundTheme}
              redrawCounter={forceRedrawCounter}
            />
            <NoitaMapBiomeLayerWrapper
              worldPixelScenes={worldPixelScenes}
              biomes={biomes}
              backgrounds={backgrounds}
              redrawCounter={forceRedrawCounter}
              chunkInfos={chunkInfos}
            />
            <NoitaMapTerrainLayerWrapper
              petriFiles={petriFileCollection}
              entityFiles={entityFileCollection}
              streamInfo={streamInfo}
              redrawCounter={forceRedrawCounter}
            />

            {/* This is not yet available */}
            {__FALSE__ && (
              <NoitaMapEntityLazyLoadingLayer
                entityFiles={entityFileCollection}
                streamInfo={streamInfo}
              />
            )}
          </>
        )}
        <MapUtilityPanel
          mapRef={mapRef}
          backgroundThemes={backgroundTheme}
          setBackgroundThemes={setBackgroundTheme}
          redraw={() => setForceRedrawCounter((c) => c + 1)}
        />
      </MapContainer>
    </ThreadsPoolContextProvider>
  );
}
