import {
  NoitaWakBiomes,
  StreamInfoBackground,
  StreamInfoFileFormat,
  WorldPixelSceneFileFormat,
} from '@noita-explorer/model-noita';
import L from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { NoitaMapTerrainLayerWrapper } from './layers/terrain/noita-map-terrain-layer-wrapper.tsx';
import { NoitaMapBiomeLayerWrapper } from './layers/biome/noita-map-biome-layer-wrapper.tsx';
import { NoitaMapEntityLazyLoadingLayer } from './layers/entity/noita-map-entity-lazy-loading-layer.tsx';
import { ThreadsPoolContextProvider } from './map-renderer-threads/threads-pool-context-provider.tsx';
import { NoitaMapBackgroundLayerWrapper } from './layers/background/noita-map-background-layer-wrapper.tsx';
import { useOrganizeWorldFiles } from './hooks/use-organize-world-files.ts';
import { Buffer } from 'buffer';
import { MapUtilityPanel } from './components/map-utility-panel.tsx';
import { useRef, useState } from 'react';
import { MapRef } from 'react-leaflet/MapContainer';
import { BackgroundThemes } from './layers/background/background-themes.ts';

export function NoitaMapContainer({
  worldPixelScenes,
  streamInfo,
  biomes,
  backgrounds,
  dataWakBuffer,
}: {
  worldPixelScenes: WorldPixelSceneFileFormat;
  streamInfo: StreamInfoFileFormat;
  biomes: NoitaWakBiomes;
  backgrounds: Record<number, Record<number, StreamInfoBackground[]>>;
  dataWakBuffer: Buffer;
}) {
  const mapRef = useRef<MapRef>(null);
  const mapCenter: L.LatLngExpression = [0, 0];
  const { petriFileCollection, entityFileCollection, mapBounds } =
    useOrganizeWorldFiles();
  const [backgroundTheme, setBackgroundTheme] =
    useState<BackgroundThemes>('dayMid');

  if (!worldPixelScenes || !streamInfo) {
    return <div>No current run detected</div>;
  }

  if (!mapBounds) {
    return <div>Calculating map bounds...</div>;
  }

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
            <NoitaMapBackgroundLayerWrapper backgroundTheme={backgroundTheme} />
            <NoitaMapBiomeLayerWrapper
              worldPixelScenes={worldPixelScenes}
              streamInfo={streamInfo}
              biomes={biomes}
              backgrounds={backgrounds}
            />
            <NoitaMapTerrainLayerWrapper
              petriFiles={petriFileCollection}
              entityFiles={entityFileCollection}
              streamInfo={streamInfo}
            />
            {Math.random() > 1 && (
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
        />
      </MapContainer>
    </ThreadsPoolContextProvider>
  );
}
