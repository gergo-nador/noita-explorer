import { useParams } from 'react-router-dom';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { EnemyOverview } from './enemy-overview.tsx';

export const WikiEnemyDetails = () => {
  const { enemyId } = useParams();
  const { data } = useNoitaDataWakStore();

  if (!data?.enemies) {
    return <div>Data wak is loading</div>;
  }

  const enemy = data.enemies.find((enemy) => enemy.id === enemyId);

  return (
    <div>
      {!enemy && <span>Select an enemy</span>}
      {enemy && <EnemyOverview key={enemy.id} enemy={enemy} />}
    </div>
  );
};
