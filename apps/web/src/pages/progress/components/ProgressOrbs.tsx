import { PixelatedImage } from '@noita-explorer/noita-component-library';
import { enumerateHelpers } from '@noita-explorer/tools';
import { useSave00Store } from '../../../stores/save00.ts';
import { Flex } from '@noita-explorer/react-utils';

export const ProgressOrbs = () => {
  const { unlockedOrbs, flags } = useSave00Store();

  const OrbGif = ({
    src,
  }: {
    src: string | 'orb_red_evil' | 'orb_picked' | 'orb_discovered';
  }) => {
    return (
      <PixelatedImage src={`/g/orb-gifs/${src}/default.gif`} height={120} />
    );
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
                      <OrbGif src='orb_picked' />
                    ) : (
                      <OrbGif src='orb_red_evil' />
                    )}
                    <div>Orb {orbId} West</div>
                  </>
                )}
              </Flex>
              <Flex center column>
                {isOrbPickedUp ? (
                  <OrbGif src='orb_picked' />
                ) : progressFlagUnlocked ? (
                  <OrbGif src='orb_discovered' />
                ) : (
                  <OrbGif src={'orb_' + orbIdString} />
                )}
                <div>Orb {orbId}</div>
              </Flex>
              <Flex center column>
                {hasEast && (
                  <>
                    {isOrbEastPickedUp ? (
                      <OrbGif src='orb_picked' />
                    ) : (
                      <OrbGif src='orb_red_evil' />
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
