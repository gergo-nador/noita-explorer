import { useParams } from 'react-router-dom';
import { PerkOverview } from './perk-overview.tsx';
import { SeoDefaultPage } from '@noita-explorer/react-utils';
import { publicPaths } from '../../../utils/public-paths.ts';
import { useDataWakService } from '../../../services/data-wak/use-data-wak-service.ts';

export const WikiPerkDetails = () => {
  const { perkId } = useParams();
  const { lookup } = useDataWakService();

  if (!perkId) {
    return <div>Perk Id empty</div>;
  }

  const perk = lookup.perks[perkId];
  if (!perk) {
    return (
      <div>
        Perk was not found with id <i>{perkId}</i>
      </div>
    );
  }

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
      <main>
        {!perk && <span>Select a perk</span>}
        {perk && <PerkOverview key={perk.id} perk={perk} />}
      </main>
    </>
  );
};
