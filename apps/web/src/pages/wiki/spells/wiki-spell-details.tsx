import { useParams } from 'react-router-dom';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { SpellOverview } from './spell-overview.tsx';
import { SeoDefaultPage } from '@noita-explorer/react-utils';
import { publicPaths } from '../../../utils/public-paths.ts';

export const WikiSpellDetails = () => {
  const { spellId } = useParams();
  const { data } = useNoitaDataWakStore();

  if (!data?.spells) {
    return <div>Data wak is loading</div>;
  }

  const spell = data.spells.find((spell) => spell.id === spellId);

  return (
    <>
      <SeoDefaultPage
        title={spell?.name ?? 'Spells - Wiki'}
        description={spell?.description ?? 'Browse any in-game spell.'}
        image={publicPaths.generated.spell.image({
          spellId: spellId as string,
          type: 'default-high-q',
        })}
      />
      <div>
        {!spell && <span>Select a spell</span>}
        {spell && <SpellOverview key={spell.id} spell={spell} />}
      </div>
    </>
  );
};
