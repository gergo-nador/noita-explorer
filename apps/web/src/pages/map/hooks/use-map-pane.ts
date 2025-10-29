import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

interface Props {
  name: string;
  zIndex: number;
  transform?: string;
}

export const useMapPane = ({ name, zIndex }: Props) => {
  const map = useMap();

  useEffect(() => {
    const pane = map.createPane(name);
    pane.style.zIndex = zIndex.toString();

    return () => {
      L.DomUtil.remove(pane);
    };
  }, [map, zIndex, name]);

  return { name };
};
