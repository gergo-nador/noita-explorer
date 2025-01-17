import { createBrowserRouter, Outlet } from 'react-router-dom';
import { MainPage } from '../pages/MainPage';

import { NoitaHolidays } from '../pages/NoitaHolidays';
import { CardPageTemplate } from '../pages/_templates/CardPageTemplate.tsx';
import { SetupDesktopPaths } from '../pages/setup/SetupDesktopPaths.tsx';
import { SetupDesktopScraper } from '../pages/setup/SetupDesktopScraper.tsx';
import { NoitaProgressTracker } from '../pages/progress/NoitaProgressTracker.tsx';
import { TabPageTemplate } from '../pages/_templates/TabPageTemplate.tsx';
import { pages } from './pages.ts';
import { NoitaProgressV2Perks } from '../pages/progress/progressv2/NoitaProgressV2Perks.tsx';
import { NoitaProgressV2Spells } from '../pages/progress/progressv2/NoitaProgressV2Spells.tsx';
import { NoitaProgressV2Enemies } from '../pages/progress/progressv2/NoitaProgressV2Enemies.tsx';
import { SetupWebPaths } from '../pages/setup/SetupWebPaths.tsx';
import { NoitaSessions } from '../pages/sessions/NoitaSessions.tsx';
import { EmptyPageTemplate } from '../pages/_templates/EmptyPageTemplate.tsx';
import { NoitaDeathMap } from '../pages/sessions/NoitaDeathMap.tsx';
import { Settings } from '../pages/settings/Settings.tsx';
import { NoitaBonesWands } from '../pages/NoitaBonesWands.tsx';
import { SettingsCursorWandPicker } from '../pages/settings/SettingsCursorWandPicker.tsx';
import { CurrentRunPage } from '../pages/world/CurrentRunPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: 'progress-tracker',
    element: (
      <CardPageTemplate>
        <NoitaProgressTracker />
      </CardPageTemplate>
    ),
  },
  {
    path: 'progress-tracker-v2',
    element: (
      <TabPageTemplate
        tabs={[
          { title: 'Perks', href: pages.progressTrackerV2.perks },
          { title: 'Spells', href: pages.progressTrackerV2.spells },
          { title: 'Enemies', href: pages.progressTrackerV2.enemies },
        ]}
      />
    ),
    children: [
      {
        path: 'perks',
        element: <NoitaProgressV2Perks />,
      },
      {
        path: 'spells',
        element: <NoitaProgressV2Spells />,
      },
      {
        path: 'enemies',
        element: <NoitaProgressV2Enemies />,
      },
    ],
  },
  {
    path: 'setup',
    element: (
      <CardPageTemplate>
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
      <CardPageTemplate>
        <NoitaHolidays />
      </CardPageTemplate>
    ),
  },
  {
    path: 'current-run',
    element: (
      <CardPageTemplate>
        <CurrentRunPage />
      </CardPageTemplate>
    ),
  },
  {
    path: 'sessions',
    element: (
      <EmptyPageTemplate>
        <NoitaSessions />
      </EmptyPageTemplate>
    ),
  },
  {
    path: 'death-map',
    element: (
      <CardPageTemplate>
        <NoitaDeathMap />
      </CardPageTemplate>
    ),
  },
  {
    path: 'bones-wands',
    element: (
      <CardPageTemplate>
        <NoitaBonesWands />
      </CardPageTemplate>
    ),
  },
  {
    path: 'settings',
    element: (
      <CardPageTemplate>
        <Settings />
      </CardPageTemplate>
    ),
  },
  {
    path: 'settings/cursor-wand-picker',
    element: (
      <CardPageTemplate>
        <SettingsCursorWandPicker />
      </CardPageTemplate>
    ),
  },
]);
