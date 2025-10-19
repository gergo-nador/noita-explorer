import { useParams } from 'react-router-dom';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { PerkOverview } from './perk-overview.tsx';
import { SeoDefaultPage } from '@noita-explorer/react-utils';
import { publicPaths } from '../../../utils/public-paths.ts';

export const WikiPerkDetails = () => {
  const { perkId } = useParams();
  const { lookup } = useNoitaDataWakStore();

  if (!lookup?.perks) {
    return <div>Data wak is loading</div>;
  }

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
