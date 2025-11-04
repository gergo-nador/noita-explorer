import { NoitaMapContainer } from './noita-map-container.tsx';
import { useDataWakLoader } from './hooks/use-data-wak-loader.ts';
import 'leaflet-edgebuffer';
import {
  BooleanIcon,
  Button,
  ProgressBar,
} from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { useOrganizeBackgroundImages } from './hooks/use-organize-background-images.ts';
import { useDataWakService } from '../../services/data-wak/use-data-wak-service.ts';
import { useOrganizeWorldFiles } from './hooks/use-organize-world-files.ts';
import { useSettingsStore } from '../../stores/settings.ts';

export const NoitaMapPage = () => {
  const { data } = useDataWakService();
  const { settings, set: setSettings } = useSettingsStore();

  const {
    isError: isDataWakError,
    progress: dataWakProgress,
    dataWakBuffer,
  } = useDataWakLoader();

  const { backgrounds, isLoaded: isBackgroundsLoaded } =
    useOrganizeBackgroundImages({ dataWakBuffer });

  const { petriFileCollection, entityFileCollection, mapBounds } =
    useOrganizeWorldFiles();

  if (!settings.map.initialPopupSeen) {
    return (
      <div style={{ maxWidth: 500 }}>
        <h3>Welcome to the Map (beta)!</h3>
        <div>A visualization of your current world.</div>
        <br />
        <div>
          Rendering the map is a <b>memory intensive</b> process. If that's an
          issue, you might want to take a look at Settings tab to reduce the
          amount of parallel workers (this reduces the memory consumption as
          well).
        </div>
        <br />
        <div>
          The Map is still in Beta, we are still fixing issues, improving
          performance, and adding new features, such as entities (enemies and
          others).
        </div>
        <br />
        <Button
          style={{ textDecoration: 'underline' }}
          onClick={() =>
            setSettings((settings) => (settings.map.initialPopupSeen = true))
          }
        >
          Cool, show me the map!
        </Button>
      </div>
    );
  }

  if (isDataWakError) {
    return <div className='text-danger'>Failed to load assets</div>;
  }

  if (!dataWakBuffer || !isBackgroundsLoaded || !mapBounds) {
    return (
      <div>
        <Flex>
          {dataWakBuffer ? (
            <>
              <span>Loading game assets...</span>
              <ProgressBar
                progress={Math.round(
                  (100 * dataWakProgress.loaded) / dataWakProgress.total,
                )}
                barColor='healthBar'
                width={250}
              />
            </>
          ) : (
            <>
              <span>Assets loaded</span>
              <BooleanIcon value={true} />
            </>
          )}
        </Flex>

        <Flex>
          {isBackgroundsLoaded ? (
            <span>Backgrounds loaded</span>
          ) : (
            <span>Loading backgrounds...</span>
          )}
        </Flex>

        <Flex>
          {mapBounds ? (
            <span>Map bounds loaded</span>
          ) : (
            <span>Calculating map bounds...</span>
          )}
        </Flex>
      </div>
    );
  }

  return (
    <NoitaMapContainer
      biomes={data.biomes}
      backgrounds={backgrounds}
      dataWakBuffer={dataWakBuffer}
      petriFileCollection={petriFileCollection}
      entityFileCollection={entityFileCollection}
      mapBounds={mapBounds}
    />
  );
};
