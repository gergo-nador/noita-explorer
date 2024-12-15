import { createBrowserRouter, Outlet } from 'react-router-dom';
import { MainPage } from '../pages/MainPage';

import { NoitaHolidays } from '../pages/NoitaHolidays';
import { DefaultPageTemplate } from '../pages/templates/DefaultPageTemplate.tsx';
import { SetupDesktopPaths } from '../pages/setup/SetupDesktopPaths.tsx';
import { SetupDesktopScraper } from '../pages/setup/SetupDesktopScraper.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  /*{
    path: 'pages',
    element: (
      <DefaultPageTemplate>
        <Outlet />
      </DefaultPageTemplate>
    ),
    children: [
      {
        path: 'progress-tracker',
        element: <NoitaProgressTracker />,
      },
      {
        path: 'progress-tracker-v2',
        element: <ProgressPageV2 />,
      },
    ],
  },*/
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
