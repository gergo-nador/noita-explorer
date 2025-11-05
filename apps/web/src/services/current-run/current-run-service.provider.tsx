import { useSave00Store } from '../../stores/save00.ts';
import { Link } from '../../components/link.tsx';
import { pages } from '../../routes/pages.ts';
import { CurrentRunServiceContext } from './current-run-service.context.ts';
import React from 'react';
import { SpaceCharacter } from '../../components/space-character.tsx';

interface Props {
  children: React.ReactNode;
}

export const CurrentRunServiceProvider = ({ children }: Props) => {
  const { status, ...rest } = useSave00Store();

  if (status === 'unset') {
    return (
      <div>
        <div>It looks like you skipped setup ;)</div>
        <div>
          Don't worry, we got you. Please visit
          <SpaceCharacter />
          <Link to={pages.setup.webPaths} isInline showUnderline>
            Setup
          </Link>
          <SpaceCharacter />
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

  if (rest.currentRun === undefined) {
    return (
      <div>
        <div>
          There is no ongoing run in your save files. Please start a new run and
          refresh the page.
        </div>
        <div>If you think this is a mistake, please contact the developers</div>
      </div>
    );
  }

  if (rest.streamInfo === undefined) {
    return <div>Failed to load flags</div>;
  } else if (rest.worldPixelScenes === undefined) {
    return <div>Failed to load world pixel scenes</div>;
  }

  return (
    <CurrentRunServiceContext
      value={{
        streamInfo: rest.streamInfo,
        worldPixelScenes: rest.worldPixelScenes,
        currentRun: rest.currentRun,
      }}
    >
      {children}
    </CurrentRunServiceContext>
  );
};
