import { useParams } from 'react-router-dom';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { EnemyOverview } from './enemy-overview.tsx';
import { SeoDefaultPage } from '@noita-explorer/react-utils';
import { publicPaths } from '../../../utils/public-paths.ts';

export const WikiEnemyDetails = () => {
  const { enemyId } = useParams();
  const { data } = useNoitaDataWakStore();

  if (!data?.enemies) {
    return <div>Data wak is loading</div>;
  }

  const enemy = data.enemies.find((enemy) => enemy.id === enemyId);

  return (
    <>
      <SeoDefaultPage
        title={enemy?.name ?? 'Enemies - Wiki'}
        description={
          enemy
            ? `${enemy.hp}❤️ ${enemy.hasGoldDrop ? enemy.goldDrop : '-'}💰`
            : 'Browse any in-game spell.'
        }
        image={publicPaths.generated.enemy.image({
          enemyId: enemyId as string,
          type: 'default-high-q',
        })}
      />
      <div>
        {!enemy && <span>Select an enemy</span>}
        {enemy && <EnemyOverview key={enemy.id} enemy={enemy} />}
      </div>
    </>
  );
};
