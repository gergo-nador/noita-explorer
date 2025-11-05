import { ImageOverlay, MapContainer, Marker, Popup } from 'react-leaflet';
import L, { LatLngBoundsExpression } from 'leaflet';
import { useDeathPositions } from './hooks/use-death-positions.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import css from './noita-death-map.module.css';
import { NoitaDeathMapUtilityPanel } from './components/noita-death-map-utility-panel.tsx';

export const NoitaDeathMap = () => {
  const mapCenter: L.LatLngExpression = [0, 0];

  const leftX = -34.5 * 512;
  const rightX = 34.5 * 512;
  const topY = -19.6 * 512;
  const bottomY = 39.5 * 512;

  const mapBounds = [
    [-topY, leftX],
    [-bottomY, rightX],
  ] as LatLngBoundsExpression;

  const { sessionsFiltered, uniqueKilledByReasons } = useDeathPositions();

  const generateColor = (index: number, total: number) => {
    const hue = (index / total) * 360; // Spread hues across 360 degrees
    return `hsl(${hue}, 70%, 50%)`; // HSL color (70% saturation, 50% lightness)
  };

  const colorMap: StringKeyDictionary<string> = uniqueKilledByReasons.reduce(
    (acc, prop, index) => {
      acc[prop] = generateColor(index, uniqueKilledByReasons.length);
      return acc;
    },
    {} as StringKeyDictionary<string>,
  );

  return (
    <MapContainer
      center={mapCenter}
      zoom={-5}
      crs={L.CRS.Simple}
      style={{ height: '80vh', width: '100%', backgroundColor: 'black' }}
      minZoom={-5}
      maxZoom={5}
      maxBounds={mapBounds}
    >
      <ImageOverlay url='/images/noita-map.webp' bounds={mapBounds} />
      {sessionsFiltered.map((session, idx) => {
        const posX = session.deathPosX % rightX;
        const posY = session.deathPosY;

        const color = session.killedByReason
          ? colorMap[session.killedByReason]
          : '#fff';

        const customIcon = L.divIcon({
          className: css['custom-marker-container'],
          html: `<div class="${css['custom-death-marker']}" style="background-color: ${color};"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        return (
          <Marker
            key={`marker-${idx}`}
            position={L.latLng(-posY, posX)}
            icon={customIcon}
          >
            <Popup>Death: {session.killedByReason}</Popup>
          </Marker>
        );
      })}
      <NoitaDeathMapUtilityPanel
        sessionsFiltered={sessionsFiltered}
        uniqueKilledByReasons={uniqueKilledByReasons}
        colorMap={colorMap}
      />
    </MapContainer>
  );
};
