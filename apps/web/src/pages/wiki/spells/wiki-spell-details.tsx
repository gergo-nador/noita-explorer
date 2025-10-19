import { useParams } from 'react-router-dom';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { SpellOverview } from './spell-overview.tsx';
import { SeoDefaultPage } from '@noita-explorer/react-utils';
import { publicPaths } from '../../../utils/public-paths.ts';

export const WikiSpellDetails = () => {
  const { spellId } = useParams();
  const { lookup } = useNoitaDataWakStore();

  if (!lookup?.spells) {
    return <div>Data wak is loading</div>;
  }

  if (!spellId) {
    return <div>Spell Id empty</div>;
  }

  const spell = lookup.spells[spellId];
  if (!spell) {
    return (
      <div>
        Spell was not found with id <i>{spellId}</i>
      </div>
    );
  }

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
      <main>
        {!spell && <span>Select a spell</span>}
        {spell && <SpellOverview key={spell.id} spell={spell} />}
      </main>
    </>
  );
};
