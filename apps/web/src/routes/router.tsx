import { createBrowserRouter } from 'react-router-dom';
import { MainPage } from '../pages/MainPage';

import { NoitaHolidays } from '../pages/NoitaHolidays';

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
  /*{
    path: 'setup',
    element: (
      <DefaultPageTemplate>
        <Outlet />
      </DefaultPageTemplate>
    ),
    children: [
      { path: 'paths', element: <NoitaScraperPathSetup /> },
      { path: 'scrape', element: <NoitaScraper /> },
    ],
  },*/
  {
    path: 'holidays',
    element: <NoitaHolidays />,
  },
]);
