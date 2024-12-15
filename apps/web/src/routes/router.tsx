import { createBrowserRouter, Outlet } from 'react-router-dom';
import { MainPage } from '../pages/MainPage';

import { NoitaHolidays } from '../pages/NoitaHolidays';
import { DefaultPageTemplate } from '../pages/templates/DefaultPageTemplate.tsx';
import { SetupDesktopPaths } from '../pages/setup/SetupDesktopPaths.tsx';
import { SetupDesktopScraper } from '../pages/setup/SetupDesktopScraper.tsx';
import { NoitaProgressTracker } from '../pages/progress/NoitaProgressTracker.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: 'progress',
    element: (
      <DefaultPageTemplate>
        <Outlet />
      </DefaultPageTemplate>
    ),
    children: [
      {
        path: 'tracker',
        element: <NoitaProgressTracker />,
      },
      /*{
        path: 'tracker-v2',
        element: <ProgressPageV2 />,
      },*/
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
