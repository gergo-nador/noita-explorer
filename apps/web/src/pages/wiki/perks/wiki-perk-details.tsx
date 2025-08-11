import { useParams } from 'react-router-dom';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { PerkOverview } from './perk-overview.tsx';
import { SeoDefaultPage } from '@noita-explorer/react-utils';
import { WikiEnemies } from '../enemies/wiki-enemies.tsx';
import { publicPaths } from '../../../utils/public-paths.ts';

export const WikiPerkDetails = () => {
  const { perkId } = useParams();
  const { data } = useNoitaDataWakStore();

  if (!data?.perks) {
    return <div>Data wak is loading</div>;
  }

  const perk = data.perks.find((perk) => perk.id === perkId);

  return (
    <>
      <SeoDefaultPage
        title={perk?.name ?? 'Perks - Wiki'}
        description={perk?.description ?? 'Browse any in-game enemy.'}
        image={publicPaths.generated.perk.image({
          perkId: perkId as string,
          type: 'default-high-q',
        })}
      />
      <WikiEnemies />
      <div>
        {!perk && <span>Select a perk</span>}
        {perk && <PerkOverview key={perk.id} perk={perk} />}
      </div>
    </>
  );
};
