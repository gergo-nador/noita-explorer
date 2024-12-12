import { createBrowserRouter } from 'react-router-dom';
import { NotFound } from '../pages/NotFound';
import { MainPage } from '../pages/MainPage';
import { NoitaDataSetup } from '../pages/NoitaDataSetup';
import { StartupPage } from '../pages/StartupPage';
import { NoitaScraperPathSetup } from '../pages/scraper/NoitaScraperPathSetup';
import { NoitaScraper } from '../pages/scraper/NoitaScraper';
import { NoitaProgressTracker } from '../pages/NoitaProgressTracker';
import { NoitaHolidays } from '../pages/NoitaHolidays';
import { ProgressPageV2 } from '../pages/ProgressPageV2';
import { DefaultPageTemplate } from '../pages/templates/DefaultPageTemplate.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StartupPage />,
  },
  {
    path: '/main',
    element: <MainPage />,
    errorElement: <NotFound />,
  },
  {
    path: 'pages',
    element: <DefaultPageTemplate />,
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
  },
  {
    path: 'setup',
    element: <NoitaDataSetup />,
    errorElement: <NotFound />,
    children: [
      { path: 'paths', element: <NoitaScraperPathSetup /> },
      { path: 'scrape', element: <NoitaScraper /> },
    ],
  },
  {
    path: 'holidays',
    element: <NoitaHolidays />,
  },
]);
