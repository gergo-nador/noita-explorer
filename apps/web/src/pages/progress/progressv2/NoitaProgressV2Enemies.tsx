import {
  ActiveProgressIcon,
  ProgressIcon,
} from '@noita-explorer/noita-component-library';
import { NoitaProgressIconTable } from '../../../components/NoitaProgressIconTable.tsx';
import { useNoitaDataWakStore } from '../../../stores/NoitaDataWak.ts';

export const NoitaProgressV2Enemies = () => {
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
        {data.enemies.map((enemy) => (
          <ActiveProgressIcon
            id={'enemy-' + enemy.id}
            key={'enemy-' + enemy.id}
            tooltip={
              <div>
                <div style={{ fontSize: 20 }}>{enemy.name}</div>
                <div>{enemy.id}</div>
              </div>
            }
          >
            <ProgressIcon type={'regular'} icon={enemy.imageBase64} />
          </ActiveProgressIcon>
        ))}
      </NoitaProgressIconTable>
    </div>
  );
};
