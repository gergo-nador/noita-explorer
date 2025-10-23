import { NoitaMap } from './components/noita-map.tsx';
import { useCollectMaterialImages } from './hooks/use-collect-material-images.ts';
import { useRef } from 'react';
import { MaterialColorCache } from './noita-map.types.ts';
import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import { useOrganizeWorldFiles } from './hooks/use-organize-world-files.ts';

export const NoitaMapPage = () => {
  const { lookup } = useNoitaDataWakStore();
  const { materialImageCache } = useCollectMaterialImages();
  const { petriFileCollection, entityFileCollection } = useOrganizeWorldFiles();
  const materialColorCacheRef = useRef<MaterialColorCache>({});

  return (
    <NoitaMap
      petriFiles={petriFileCollection}
      entityFiles={entityFileCollection}
      materials={lookup?.materials ?? {}}
      materialImageCache={materialImageCache}
      materialColorCache={materialColorCacheRef.current}
    />
  );
};
