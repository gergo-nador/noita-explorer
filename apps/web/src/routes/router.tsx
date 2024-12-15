import { createBrowserRouter, Outlet } from 'react-router-dom';
import { MainPage } from '../pages/MainPage';

import { NoitaHolidays } from '../pages/NoitaHolidays';
import { DefaultPageTemplate } from '../pages/templates/DefaultPageTemplate.tsx';
import { SetupDesktopPaths } from '../pages/scraper/SetupDesktopPaths.tsx';
import { SetupDesktopDataWak } from '../pages/scraper/SetupDesktopDataWak.tsx';

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
      { path: 'scrape', element: <SetupDesktopDataWak /> },
    ],
  },
  {
    path: 'holidays',
    element: <NoitaHolidays />,
  },
]);
