import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';
import { useSave00Store } from '../../stores/save00.ts';
import {
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';

export const CurrentRunPerksView = () => {
  const { data } = useNoitaDataWakStore();
  const { currentRun } = useSave00Store();

  if (!data || !currentRun) {
    return <div></div>;
  }

  const previewPerks = [...currentRun.worldState.perks.pickedPerks.slice(0, 6)];

  return (
    <div style={{ paddingRight: '45px' }}>
      <Flex gap={4} column align='end'>
        {previewPerks.map((pickedPerk) => {
          const perk = data.perks.find((p) => p.id === pickedPerk.perkId);

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
              <img
                src={perk.imageBase64}
                alt={perk.name}
                style={{
                  width: '32px',
                  height: '32px',
                  imageRendering: 'pixelated',
                }}
              />
            </NoitaTooltipWrapper>
          );
        })}
      </Flex>
    </div>
  );
};
