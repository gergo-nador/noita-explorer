import {
  NoitaWakBiomes,
  StreamInfoBackground,
} from '@noita-explorer/model-noita';
import L from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { NoitaMapTerrainLayerWrapper } from './layers/terrain/noita-map-terrain-layer-wrapper.tsx';
import { NoitaMapBiomeLayerWrapper } from './layers/biome/noita-map-biome-layer-wrapper.tsx';
import { NoitaMapBackgroundLayerWrapper } from './layers/background/noita-map-background-layer-wrapper.tsx';
import { MapUtilityPanel } from './components/map-utility-panel.tsx';
import { useRef, useState } from 'react';
import { MapRef } from 'react-leaflet/MapContainer';
import { BackgroundThemes } from './layers/background/background-themes.ts';
import { useCurrentRunService } from '../../services/current-run/use-current-run-service.ts';
import {
  ChunkInfoCollection,
  MapBounds,
  NoitaPetriFileCollection,
} from './noita-map.types.ts';

interface Props {
  biomes: NoitaWakBiomes;
  backgrounds: Record<number, Record<number, StreamInfoBackground[]>>;
  petriFileCollection: NoitaPetriFileCollection;
  mapBounds: MapBounds;
  chunkInfos: ChunkInfoCollection;
}

export function NoitaMapContainer({
  biomes,
  backgrounds,
  petriFileCollection,
  mapBounds,
  chunkInfos,
}: Props) {
  const { worldPixelScenes } = useCurrentRunService();
  const [forceRedrawCounter, setForceRedrawCounter] = useState(0);
  const mapRef = useRef<MapRef>(null);
  const mapCenter: L.LatLngExpression = [0, 0];

  const [backgroundTheme, setBackgroundTheme] =
    useState<BackgroundThemes>('dayMid');

  const mapBoundsPadding = 4 * 512;

  return (
    <MapContainer
      center={mapCenter}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: '80vh', width: '100%' }}
      crs={L.CRS.Simple}
      maxBounds={[
        [-mapBounds.maxY - mapBoundsPadding, mapBounds.minX - mapBoundsPadding],
        [-mapBounds.minY + mapBoundsPadding, mapBounds.maxX + mapBoundsPadding],
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
            redrawCounter={forceRedrawCounter}
          />
        </>
      )}
      <MapUtilityPanel
        mapRef={mapRef}
        backgroundThemes={backgroundTheme}
        setBackgroundThemes={setBackgroundTheme}
        redraw={() => setForceRedrawCounter((c) => c + 1)}
      />
    </MapContainer>
  );
}
