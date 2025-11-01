import {
  NoitaWakBiomes,
  StreamInfoFileFormat,
  WorldPixelSceneFileFormat,
} from '@noita-explorer/model-noita';
import L from 'leaflet';
import { MapContainer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { CSSProperties, useState } from 'react';
import { NoitaMapMainTerrainLayer } from './layers/main/noita-map-main-terrain-layer.tsx';
import { NoitaMapBiomeLayer } from './layers/biome/noita-map-biome-layer.tsx';
import { NoitaMapEntityLazyLoadingLayer } from './layers/entity/noita-map-entity-lazy-loading-layer.tsx';
import { ThreadsPoolContextProvider } from './map-renderer-threads/threads-pool-context-provider.tsx';
import { NoitaMapBackgroundLayer } from './layers/background/noita-map-background-layer.tsx';
import { useOrganizeWorldFiles } from './hooks/use-organize-world-files.ts';

export function NoitaMapContainer({
  worldPixelScenes,
  streamInfo,
  biomes,
}: {
  worldPixelScenes: WorldPixelSceneFileFormat;
  streamInfo: StreamInfoFileFormat;
  biomes: NoitaWakBiomes;
}) {
  const mapCenter: L.LatLngExpression = [0, 0];
  const { petriFileCollection, entityFileCollection, mapBounds } =
    useOrganizeWorldFiles();

  if (!worldPixelScenes || !streamInfo) {
    return <div>No current run detected</div>;
  }

  if (!mapBounds) {
    return <div>Calculating map bounds...</div>;
  }

  const mapBoundsPadding = 4 * 512;

  return (
    <ThreadsPoolContextProvider>
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
      >
        {/* HERE is the change! We use our custom layer now.
         */}
        {!__SSG__ && (
          <>
            <NoitaMapBackgroundLayer />
            <NoitaMapBiomeLayer
              worldPixelScenes={worldPixelScenes}
              streamInfo={streamInfo}
              biomes={biomes}
            />
            <NoitaMapMainTerrainLayer
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

        {/* You can still have other layers like markers on top */}
        <Marker position={[2, 0]}>
          <Popup>Test Marker</Popup>
        </Marker>

        {/* Example marker */}
        <Marker position={[0, 0]}>
          <Popup>
            The Holy Mountain <br /> (This is a test marker)
          </Popup>
        </Marker>

        <MouseCoordinates />
      </MapContainer>
    </ThreadsPoolContextProvider>
  );
}

const MouseCoordinates = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    mousemove(e) {
      // The 'e.latlng' object contains the coordinates in the map's CRS.
      // For L.CRS.Simple, 'lat' is the y-coordinate and 'lng' is the x-coordinate.
      setPosition(e.latlng);
    },
    // Hide coordinates when mouse leaves the map
    mouseout() {
      setPosition(null);
    },
  });

  // Style for the coordinate display box
  const positionStyle: CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: '5px 10px',
    borderRadius: '5px',
    zIndex: 1000, // Ensure it's on top
    fontFamily: 'monospace',
    color: 'black',
  };

  return position ? (
    <div style={positionStyle}>
      X: {position.lng.toFixed(2)}, Y: {-position.lat.toFixed(2)}
    </div>
  ) : null; // Don't render anything if the mouse is off the map
};
