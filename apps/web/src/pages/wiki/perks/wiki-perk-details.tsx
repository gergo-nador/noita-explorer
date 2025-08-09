import { useParams } from 'react-router-dom';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { PerkOverview } from './perk-overview.tsx';

export const WikiPerkDetails = () => {
  const { perkId } = useParams();
  const { data } = useNoitaDataWakStore();

  if (!data?.perks) {
    return <div>Data wak is loading</div>;
  }

  const perk = data.perks.find((perk) => perk.id === perkId);

  return (
    <div>
      {!perk && <span>Select a perk</span>}
      {perk && <PerkOverview key={perk.id} perk={perk} />}
    </div>
  );
};
