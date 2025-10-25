import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaMaterial } from '@noita-explorer/model-noita';
import L from 'leaflet';
import { MapContainer, Marker, Popup, useMapEvents } from 'react-leaflet';
import {
  MaterialColorCache,
  MaterialImageCache,
  NoitaEntityFileCollection,
  NoitaPetriFileCollection,
} from './noita-map.types.ts';
import { CSSProperties, useState } from 'react';
import { NoitaMapMainTerrainLayer } from './layers/main/noita-map-main-terrain-layer.tsx';
import { NoitaMapBiomeLayer } from './layers/biome/noita-map-biome-layer.tsx';

export function NoitaMapContainer({
  petriFiles,
  entityFiles,
  materials,
  materialImageCache,
  materialColorCache,
}: {
  petriFiles: NoitaPetriFileCollection;
  entityFiles: NoitaEntityFileCollection;
  materials: StringKeyDictionary<NoitaMaterial>;
  materialImageCache: MaterialImageCache;
  materialColorCache: MaterialColorCache;
}) {
  // The Noita world is huge, so you'll adjust this center point later.
  // Using [0, 0] as a starting default.
  const mapCenter: L.LatLngExpression = [0, 0];

  return (
    <MapContainer
      center={mapCenter}
      zoom={3} // Start with a zoom level that shows a good area
      scrollWheelZoom={true}
      style={{ height: '80vh', width: '100%' }} // Important: Map needs a defined size
      crs={L.CRS.Simple} // Use a simple coordinate system for a game map
    >
      {/* HERE is the change! We use our custom layer now.
       */}
      {!__SSG__ && (
        <>
          <NoitaMapBiomeLayer />
          <NoitaMapMainTerrainLayer
            petriFiles={petriFiles}
            entityFiles={entityFiles}
            materials={materials}
            materialColorCache={materialColorCache}
            materialImageCache={materialImageCache}
          />
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
      X: {position.lng.toFixed(2)}, Y: {position.lat.toFixed(2)}
    </div>
  ) : null; // Don't render anything if the mouse is off the map
};
