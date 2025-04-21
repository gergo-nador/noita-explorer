import {
  ActiveIconWrapper,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaSpellTypesDictionary } from '../../../../noita/NoitaSpellTypeDictionary.ts';
import { NoitaProgressIconTable } from '../../../../components/NoitaProgressIconTable.tsx';
import { useNoitaDataWakStore } from '../../../../stores/NoitaDataWak.ts';

export const NoitaProgressV2Spells = () => {
  const { data } = useNoitaDataWakStore();

  if (!data) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  return (
    <div>
      <NoitaProgressIconTable
        count={data.spells.length}
        name={'Spells'}
        columnCount={12}
      >
        {data.spells.map((spell) => (
          <ActiveIconWrapper
            id={'spell-' + spell.id}
            key={'spell-' + spell.id}
            tooltip={
              <div>
                <div style={{ fontSize: 20 }}>{spell.name}</div>
              </div>
            }
          >
            <ProgressIcon
              type={'regular'}
              icon={spell.imageBase64}
              spellBackground={NoitaSpellTypesDictionary[spell.type].image}
            />
          </ActiveIconWrapper>
        ))}
      </NoitaProgressIconTable>
    </div>
  );
};
