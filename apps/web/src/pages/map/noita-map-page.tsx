import { NoitaMapContainer } from './noita-map-container.tsx';
import { useCollectMaterialImages } from './hooks/use-collect-material-images.ts';
import { useRef } from 'react';
import { MaterialColorCache } from './noita-map.types.ts';
import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import { useOrganizeWorldFiles } from './hooks/use-organize-world-files.ts';
import { useSave00Store } from '../../stores/save00.ts';

export const NoitaMapPage = () => {
  const { lookup, data } = useNoitaDataWakStore();
  const { materialImageCache } = useCollectMaterialImages();
  const { petriFileCollection, entityFileCollection } = useOrganizeWorldFiles();
  const materialColorCacheRef = useRef<MaterialColorCache>({});
  const { worldPixelScenes, streamInfo, currentRun } = useSave00Store();

  if (!data) {
    return <div>Data wak is loading</div>;
  }

  console.log(worldPixelScenes, streamInfo);

  if (!worldPixelScenes || !streamInfo || !currentRun) {
    return <div>No current run detected</div>;
  }

  return (
    <NoitaMapContainer
      petriFiles={petriFileCollection}
      entityFiles={entityFileCollection}
      materials={lookup?.materials ?? {}}
      materialImageCache={materialImageCache}
      materialColorCache={materialColorCacheRef.current}
      worldPixelScenes={worldPixelScenes}
      streamInfo={streamInfo}
      biomes={data.biomes}
    />
  );
};
