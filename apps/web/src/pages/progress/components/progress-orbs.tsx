import { PixelatedImage } from '@noita-explorer/noita-component-library';
import { enumerateHelpers } from '@noita-explorer/tools';
import { useSave00Store } from '../../../stores/save00.ts';
import { Flex } from '@noita-explorer/react-utils';
import { publicPaths } from '../../../utils/public-paths.ts';

export const ProgressOrbs = () => {
  const { unlockedOrbs, flags } = useSave00Store();

  const OrbGif = ({
    orbId,
  }: {
    orbId: string | 'orb_red_evil' | 'orb_picked' | 'orb_discovered';
  }) => {
    const path = publicPaths.generated.orbs({ orbId: orbId }).gif;
    return <PixelatedImage src={path} height={120} />;
  };

  return (
    <Flex width='100%' justify='center'>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          maxWidth: '600px',
          width: '100%',
          gap: 16,
        }}
      >
        {enumerateHelpers.range(0, 12).map((orbId) => {
          const orbIdString = String(orbId).padStart(2, '0');
          const hasEast = orbId < 11;
          const hasWest = orbId < 11;

          const progressFlagUnlocked = flags?.has(
            'progress_orb_pickup_' + orbIdString,
          );
          const isOrbPickedUp = unlockedOrbs?.includes(String(orbId));
          const isOrbWestPickedUp = unlockedOrbs?.includes(String(orbId + 128));
          const isOrbEastPickedUp = unlockedOrbs?.includes(String(orbId + 256));

          return (
            <>
              <Flex center column>
                {hasWest && (
                  <>
                    {isOrbWestPickedUp ? (
                      <OrbGif orbId='orb_picked' />
                    ) : (
                      <OrbGif orbId='orb_red_evil' />
                    )}
                    <div>Orb {orbId} West</div>
                  </>
                )}
              </Flex>
              <Flex center column>
                {isOrbPickedUp ? (
                  <OrbGif orbId='orb_picked' />
                ) : progressFlagUnlocked ? (
                  <OrbGif orbId='orb_discovered' />
                ) : (
                  <OrbGif orbId={'orb_' + orbIdString} />
                )}
                <div>Orb {orbId}</div>
              </Flex>
              <Flex center column>
                {hasEast && (
                  <>
                    {isOrbEastPickedUp ? (
                      <OrbGif orbId='orb_picked' />
                    ) : (
                      <OrbGif orbId='orb_red_evil' />
                    )}
                    <div>Orb {orbId} East</div>
                  </>
                )}
              </Flex>
            </>
          );
        })}
      </div>
    </Flex>
  );
};
