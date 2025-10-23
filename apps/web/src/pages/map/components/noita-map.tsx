import { StringKeyDictionary } from '@noita-explorer/model';
import { NoitaMaterial } from '@noita-explorer/model-noita';
import L from 'leaflet';
import { MapContainer, Marker, Popup } from 'react-leaflet';
import { CustomNoitaLayer } from './noita-map-custom-layer.tsx';
import {
  MaterialColorCache,
  MaterialImageCache,
  NoitaEntityFileCollection,
  NoitaPetriFileCollection,
} from '../noita-map.types.ts';

export function NoitaMap({
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
        <CustomNoitaLayer
          petriFiles={petriFiles}
          entityFiles={entityFiles}
          materials={materials}
          materialColorCache={materialColorCache}
          materialImageCache={materialImageCache}
        />
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
    </MapContainer>
  );
}
