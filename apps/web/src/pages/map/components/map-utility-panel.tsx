import { Dispatch, RefObject, useEffect, useState } from 'react';
import L from 'leaflet';
import { useMap, useMapEvents } from 'react-leaflet';
import { Flex } from '@noita-explorer/react-utils';
import { MapRef } from 'react-leaflet/MapContainer';
import { BackgroundThemes } from '../layers/background/background-themes.ts';

interface Props {
  mapRef: RefObject<MapRef>;
  backgroundThemes: BackgroundThemes;
  setBackgroundThemes: Dispatch<BackgroundThemes>;
  redraw: VoidFunction;
}

export const MapUtilityPanel = ({
  mapRef,
  backgroundThemes,
  setBackgroundThemes,
  redraw,
}: Props) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  useMapEvents({
    mousemove(e) {
      setPosition(e.latlng);
    },
    mouseout() {
      setPosition(null);
    },
  });

  useEffect(() => {
    const callback = () => {
      map.invalidateSize();
    };

    document.addEventListener('fullscreenchange', callback);
    return () => document.removeEventListener('fullscreenchange', callback);
  }, [map]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        backgroundColor: 'rgb(69,69,69)',
        padding: '5px 10px',
        borderRadius: '5px',
        zIndex: 1000,
        fontFamily: 'monospace',
        color: 'white',
      }}
    >
      <Flex align='center' justify='space-between' gap={16}>
        <div>Coords</div>
        <Flex gap={12}>
          <span>({position ? position.lng.toFixed(0) : '-'}</span>
          <span>{position ? -position.lat.toFixed(0) : '-'})</span>
        </Flex>
      </Flex>
      <Flex align='center' justify='space-between' gap={16}>
        <div>Chunk</div>
        <Flex gap={12}>
          <span>({position ? Math.floor(position.lng / 512) : '-'}</span>
          <span>{position ? Math.floor(-position.lat / 512) : '-'})</span>
        </Flex>
      </Flex>

      <select
        value={backgroundThemes}
        onChange={(newValue) =>
          setBackgroundThemes(newValue.target.value as BackgroundThemes)
        }
        style={{ width: '100%' }}
      >
        <option value='dayStart'>Day 1</option>
        <option value='dayMid'>Day 2</option>
        <option value='sunsetStart'>Sunset 1</option>
        <option value='sunsetMid'>Sunset 2</option>
        <option value='nightStart'>Night 1</option>
        <option value='nightMid'>Night 2</option>
        <option value='sunriseStart'>Sunrise 1</option>
        <option value='sunriseMid'>Sunrise 2</option>
      </select>

      <div>
        {document.fullscreenEnabled &&
          (document.fullscreenElement ? (
            <button onClick={() => document.exitFullscreen()}>
              Exit Full Screen
            </button>
          ) : (
            <button
              onClick={() => {
                if (!mapRef.current) return;

                // @ts-expect-error _container is a non-public property, but we'll access it anyway
                const element = mapRef.current._container as HTMLDivElement;
                element?.requestFullscreen();
              }}
            >
              Full Screen
            </button>
          ))}

        <button onClick={() => redraw()}>Force redraw</button>
      </div>
    </div>
  );
};
