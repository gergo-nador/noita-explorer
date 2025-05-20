import { createBrowserRouter, Outlet } from 'react-router-dom';
import { MainPage } from '../pages/main-page.tsx';

import { NoitaHolidays } from '../pages/holidays/noita-holidays.tsx';
import { CardPageTemplate } from '../pages/_templates/card-page-template.tsx';
import { SetupDesktopPaths } from '../pages/setup/setup-desktop-paths.tsx';
import { SetupDesktopScraper } from '../pages/setup/setup-desktop-scraper.tsx';
import { NoitaProgressTracker } from '../pages/progress/noita-progress-tracker.tsx';
import { TabPageTemplate } from '../pages/_templates/tab-page-template.tsx';
import { pages } from './pages.ts';
import { WikiPerks } from '../pages/wiki/perks/wiki-perks.tsx';
import { WikiSpells } from '../pages/wiki/spells/wiki-spells.tsx';
import { WikiEnemies } from '../pages/wiki/enemies/wiki-enemies.tsx';
import { SetupWebPaths } from '../pages/setup/setup-web-paths.tsx';
import { NoitaSessions } from '../pages/sessions/noita-sessions.tsx';
import { EmptyPageTemplate } from '../pages/_templates/empty-page-template.tsx';
import { NoitaDeathMap } from '../pages/noita-death-map.tsx';
import { Settings } from '../pages/settings/settings.tsx';
import { NoitaBonesWands } from '../pages/noita-bones-wands.tsx';
import { SettingsCursorWandPicker } from '../pages/settings/settings-cursor-wand-picker.tsx';
import { CurrentRun } from '../pages/world/current-run.tsx';
import { WikiMaterialsTree } from '../pages/wiki/wiki-materials-tree.tsx';
import { WikiMaterials } from '../pages/wiki/materials/wiki-materials.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: 'progress-tracker',
    element: (
      <CardPageTemplate returnPath={'/'}>
        <NoitaProgressTracker />
      </CardPageTemplate>
    ),
  },
  {
    path: 'wiki',
    element: (
      <TabPageTemplate
        returnPath={'/'}
        tabs={[
          { title: 'Perks', href: pages.wiki.perks },
          { title: 'Spells', href: pages.wiki.spells },
          { title: 'Enemies', href: pages.wiki.enemies },
          { title: 'Materials', href: pages.wiki.materials },
          {
            title: 'Materials Tree',
            href: pages.wiki.materialsTree,
          },
        ]}
      />
    ),
    children: [
      {
        path: 'perks',
        element: <WikiPerks />,
      },
      {
        path: 'spells',
        element: <WikiSpells />,
      },
      {
        path: 'enemies',
        element: <WikiEnemies />,
      },
      {
        path: 'materials',
        element: <WikiMaterials />,
      },
      {
        path: 'materials-tree',
        element: <WikiMaterialsTree />,
      },
    ],
  },
  {
    path: 'setup',
    element: (
      <CardPageTemplate returnPath={'/'}>
        <Outlet />
      </CardPageTemplate>
    ),
    children: [
      { path: 'desktop-paths', element: <SetupDesktopPaths /> },
      { path: 'desktop-scrape', element: <SetupDesktopScraper /> },
      { path: 'web-paths', element: <SetupWebPaths /> },
    ],
  },
  {
    path: 'holidays',
    element: (
      <CardPageTemplate returnPath={'/'}>
        <NoitaHolidays />
      </CardPageTemplate>
    ),
  },
  {
    path: 'current-run',
    element: (
      <CardPageTemplate returnPath={'/'}>
        <CurrentRun />
      </CardPageTemplate>
    ),
  },
  {
    path: 'sessions',
    element: (
      <EmptyPageTemplate returnPath={'/'}>
        <NoitaSessions />
      </EmptyPageTemplate>
    ),
  },
  {
    path: 'death-map',
    element: (
      <CardPageTemplate returnPath={'/'}>
        <NoitaDeathMap />
      </CardPageTemplate>
    ),
  },
  {
    path: 'bones-wands',
    element: (
      <CardPageTemplate returnPath={'/'}>
        <NoitaBonesWands />
      </CardPageTemplate>
    ),
  },
  {
    path: 'settings',
    element: (
      <CardPageTemplate returnPath={'/'}>
        <Settings />
      </CardPageTemplate>
    ),
  },
  {
    path: 'settings/cursor-wand-picker',
    element: (
      <CardPageTemplate returnPath={'/settings'}>
        <SettingsCursorWandPicker />
      </CardPageTemplate>
    ),
  },
]);
