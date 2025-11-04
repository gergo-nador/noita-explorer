import { useSave00Store } from '../../stores/save00.ts';
import {
  Icon,
  NoitaTooltipWrapper,
  PixelatedImage,
} from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { publicPaths } from '../../utils/public-paths.ts';
import { useDataWakService } from '../../services/data-wak/use-data-wak-service.ts';

export const CurrentRunPerksView = () => {
  const { lookup } = useDataWakService();
  const { currentRun } = useSave00Store();

  if (!lookup || !currentRun) {
    return <div></div>;
  }

  const previewPerks = [...currentRun.worldState.perks.pickedPerks.slice(0, 6)];

  return (
    <div style={{ paddingRight: '45px' }}>
      <Flex gap={4} column align='end'>
        {previewPerks.map((pickedPerk) => {
          const perk = lookup.perks[pickedPerk.perkId];

          if (!perk) {
            return (
              <div style={{ marginTop: 4, marginBottom: 4 }}>
                <NoitaTooltipWrapper content={'Missing Perk'}>
                  <Icon type={'error'} size={28} />
                </NoitaTooltipWrapper>
              </div>
            );
          }

          return (
            <NoitaTooltipWrapper content={perk.name} placement={'right'}>
              <PixelatedImage
                src={publicPaths.generated.perk.image({ perkId: perk.id })}
                alt={perk.name}
                style={{
                  width: '32px',
                  height: '32px',
                }}
              />
            </NoitaTooltipWrapper>
          );
        })}
      </Flex>
    </div>
  );
};
