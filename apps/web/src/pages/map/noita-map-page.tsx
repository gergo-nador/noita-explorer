import { NoitaMapContainer } from './noita-map-container.tsx';
import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import { useSave00Store } from '../../stores/save00.ts';
import { useDataWakLoader } from './hooks/use-data-wak-loader.ts';

export const NoitaMapPage = () => {
  const { data } = useNoitaDataWakStore();
  const { worldPixelScenes, streamInfo, currentRun } = useSave00Store();
  const {
    isLoaded: isDataWakLoaded,
    isError: isDataWakError,
    progress: dataWakProgress,
  } = useDataWakLoader();

  if (!data) {
    return <div>Data wak is loading</div>;
  }

  if (!worldPixelScenes || !streamInfo || !currentRun) {
    return <div>No current run detected</div>;
  }

  if (isDataWakError) {
    return <div className='text-danger'>Failed to load assets</div>;
  }

  if (!isDataWakLoaded) {
    return (
      <div>
        Loading assets{' '}
        {Math.round((100 * dataWakProgress.loaded) / dataWakProgress.total)}%
      </div>
    );
  }

  return (
    <NoitaMapContainer
      biomes={data.biomes}
      streamInfo={streamInfo}
      worldPixelScenes={worldPixelScenes}
    />
  );
};
