import React from 'react';
import { Save00ServiceContext } from './save00-service.context.ts';
import { useSave00Store } from '../../stores/save00.ts';
import { Link } from '../../components/link.tsx';
import { pages } from '../../routes/pages.ts';

interface Props {
  children: React.ReactNode;
}

export const Save00ServiceProvider = ({ children }: Props) => {
  const { status, ...rest } = useSave00Store();

  if (status === 'unset') {
    return (
      <div>
        <div>It looks like you skipped setup ;)</div>
        <div>
          Don't worry, we got you. Please visit
          <Link to={pages.setup.webPaths}> Setup </Link>
          and select your save00 folder.
        </div>
      </div>
    );
  }
  if (status === 'loading') {
    return <div>Loading save00...</div>;
  }
  if (status === 'failed') {
    return <div className='text-danger'>Error: Failed to load save00</div>;
  }
  if (status !== 'loaded') {
    return <div>Unknown save00 status??? pls report it to the dev team.</div>;
  }

  if (rest.flags === undefined) {
    return <div>Failed to load flags</div>;
  } else if (rest.bonesWands === undefined) {
    return <div>Failed to load bones wands</div>;
  } else if (rest.enemyStatistics === undefined) {
    return <div>Failed to load enemy statistics</div>;
  } else if (rest.sessions === undefined) {
    return <div>Failed to load sessions</div>;
  } else if (rest.unlockedOrbs === undefined) {
    return <div>Failed to load unlocked orbs</div>;
  }

  return (
    <Save00ServiceContext
      value={{
        flags: rest.flags,
        bonesWands: rest.bonesWands,
        enemyStatistics: rest.enemyStatistics,
        unlockedPerks: rest.unlockedPerks,
        unlockedSpells: rest.unlockedSpells,
        sessions: rest.sessions,
        unlockedOrbs: rest.unlockedOrbs,
      }}
    >
      {children}
    </Save00ServiceContext>
  );
};
