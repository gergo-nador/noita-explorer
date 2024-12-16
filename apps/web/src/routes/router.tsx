import { createBrowserRouter, Outlet } from 'react-router-dom';
import { MainPage } from '../pages/MainPage';

import { NoitaHolidays } from '../pages/NoitaHolidays';
import { DefaultPageTemplate } from '../pages/templates/DefaultPageTemplate.tsx';
import { SetupDesktopPaths } from '../pages/setup/SetupDesktopPaths.tsx';
import { SetupDesktopScraper } from '../pages/setup/SetupDesktopScraper.tsx';
import { NoitaProgressTracker } from '../pages/progress/NoitaProgressTracker.tsx';
import { TabPageTemplate } from '../pages/templates/TabPageTemplate.tsx';
import { pages } from './pages.ts';
import { NoitaProgressV2Perks } from '../pages/progress/progressv2/NoitaProgressV2Perks.tsx';
import { NoitaProgressV2Spells } from '../pages/progress/progressv2/NoitaProgressV2Spells.tsx';
import { NoitaProgressV2Enemies } from '../pages/progress/progressv2/NoitaProgressV2Enemies.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: 'progress-tracker',
    element: (
      <DefaultPageTemplate>
        <NoitaProgressTracker />
      </DefaultPageTemplate>
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
      <DefaultPageTemplate>
        <Outlet />
      </DefaultPageTemplate>
    ),
    children: [
      { path: 'paths', element: <SetupDesktopPaths /> },
      { path: 'scrape', element: <SetupDesktopScraper /> },
    ],
  },
  {
    path: 'holidays',
    element: <NoitaHolidays />,
  },
]);
