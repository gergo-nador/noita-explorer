import { useParams } from 'react-router-dom';
import { EnemyOverview } from './enemy-overview.tsx';
import { SeoDefaultPage } from '@noita-explorer/react-utils';
import { publicPaths } from '../../../utils/public-paths.ts';
import { useDataWakService } from '../../../services/data-wak/use-data-wak-service.ts';

export const WikiEnemyDetails = () => {
  const { enemyId } = useParams();
  const { lookup } = useDataWakService();

  if (!enemyId) {
    return <div>Enemy Id empty</div>;
  }

  const enemy = lookup.enemies[enemyId];
  if (!enemy) {
    return (
      <div>
        Enemy was not found with id <i>{enemyId}</i>
      </div>
    );
  }

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
      <main>
        {!enemy && <span>Select an enemy</span>}
        {enemy && <EnemyOverview key={enemy.id} enemy={enemy} />}
      </main>
    </>
  );
};
