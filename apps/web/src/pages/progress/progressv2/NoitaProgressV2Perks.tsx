import {
  ActiveIconWrapper,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaProgressIconTable } from '../../../components/NoitaProgressIconTable.tsx';
import { useNoitaDataWakStore } from '../../../stores/NoitaDataWak.ts';

export const NoitaProgressV2Perks = () => {
  const { data } = useNoitaDataWakStore();

  if (!data) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  return (
    <div>
      <NoitaProgressIconTable
        count={data.spells.length}
        name={'Spells'}
        columnCount={9}
      >
        {data.perks.map((perk) => (
          <ActiveIconWrapper
            id={'perk-' + perk.id}
            key={'perk-' + perk.id}
            tooltip={
              <div>
                <div style={{ fontSize: 20 }}>{perk.name}</div>
              </div>
            }
          >
            <ProgressIcon type={'regular'} icon={perk.imageBase64} />
          </ActiveIconWrapper>
        ))}
      </NoitaProgressIconTable>
    </div>
  );
};
