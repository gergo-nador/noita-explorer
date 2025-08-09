import { createBrowserRouter, Outlet } from 'react-router-dom';
import { DocumentTitle } from '@noita-explorer/react-utils';
import { pages } from './pages.ts';
import { noitaAPI } from '../utils/noita-api.ts';

import { MainPage } from '../pages/main-page.tsx';
import { NoitaHolidays } from '../pages/holidays/noita-holidays.tsx';
import { CardPageTemplate } from '../pages/_templates/card-page-template.tsx';
import { SetupDesktopPaths } from '../pages/setup/setup-desktop-paths.tsx';
import { SetupDesktopScraper } from '../pages/setup/setup-desktop-scraper.tsx';
import { NoitaProgressTracker } from '../pages/progress/noita-progress-tracker.tsx';
import { TabPageTemplate } from '../pages/_templates/tab-page-template.tsx';
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
import { Credits } from '../pages/credits.tsx';
import { NoitaProgressTrackerSecrets } from '../pages/progress/noita-progress-tracker-secrets.tsx';
import { NoitaProgressTrackerPillar } from '../pages/progress/noita-progress-tracker-pillar/noita-progress-tracker-pillar.tsx';
import { Sandbox } from '../pages/sandbox.tsx';
import { PageBackground } from '../components/page-background.tsx';
import { ErrorPage } from '../pages/_errors/error-page.tsx';
import { WikiPerkDetails } from '../pages/wiki/perks/wiki-perk-details.tsx';
import { NoitaRouteObject } from './router.types.ts';
import { noitaDataWakStore } from '../stores/noita-data-wak.ts';

export const routes: NoitaRouteObject[] = [
  {
    path: '',
    element: (
      <>
        <PageBackground />
        <Outlet />
      </>
    ),
    errorElement: (
      <>
        <PageBackground />
        <ErrorPage />
      </>
    ),
    children: [
      {
        path: '',
        element: (
          <DocumentTitle title='Noita Explorer'>
            <MainPage />
          </DocumentTitle>
        ),
      },
      {
        path: 'progress-tracker',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: (
              <DocumentTitle title='Progress Tracker'>
                <CardPageTemplate returnPath={pages.main}>
                  <NoitaProgressTracker />
                </CardPageTemplate>
              </DocumentTitle>
            ),
          },
          {
            path: 'secrets',
            element: (
              <TabPageTemplate
                returnPath={pages.progressTracker.index}
                tabs={[
                  { title: 'General', href: pages.progressTracker.secrets },
                  {
                    title: 'Achievement Pillar',
                    href: pages.progressTracker.achievementPillar,
                  },
                ]}
              />
            ),
            children: [
              {
                path: '',
                element: (
                  <DocumentTitle title='Secrets - Progress Tracker'>
                    <NoitaProgressTrackerSecrets />
                  </DocumentTitle>
                ),
              },
              {
                path: 'pillar',
                element: (
                  <DocumentTitle title='Achievement Pillar - Progress Tracker'>
                    <NoitaProgressTrackerPillar />
                  </DocumentTitle>
                ),
              },
            ],
          },
        ],
      },
      {
        path: 'wiki',
        element: (
          <TabPageTemplate
            returnPath={pages.main}
            tabs={[
              { title: 'Perks', href: pages.wiki.perks },
              { title: 'Spells', href: pages.wiki.spells },
              { title: 'Enemies', href: pages.wiki.enemies },
              { title: 'Materials', href: pages.wiki.materials },
              ...addIf(__ENV__ !== 'production', {
                title: 'Materials Tree',
                href: pages.wiki.materialsTree,
              }),
            ]}
          />
        ),
        children: [
          {
            path: 'perks',
            element: (
              <DocumentTitle title='Perks - Wiki'>
                <WikiPerks />
              </DocumentTitle>
            ),
            children: [
              {
                path: ':perkId',
                element: <WikiPerkDetails />,
                getAllDynamicParams: () => {
                  const perkIds = noitaDataWakStore
                    .getState()
                    .data?.perks?.map((perk) => perk.id);

                  if (perkIds === undefined) {
                    return [];
                  }

                  return perkIds;
                },
              },
            ],
          },
          {
            path: 'spells',
            element: (
              <DocumentTitle title='Spells - Wiki'>
                <WikiSpells />
              </DocumentTitle>
            ),
          },
          {
            path: 'enemies',
            element: (
              <DocumentTitle title='Enemies - Wiki'>
                <WikiEnemies />
              </DocumentTitle>
            ),
          },
          {
            path: 'materials',
            element: (
              <DocumentTitle title='Materials - Wiki'>
                <WikiMaterials />
              </DocumentTitle>
            ),
          },
          ...addIf(__ENV__ !== 'production', {
            path: 'materials-tree',
            element: (
              <DocumentTitle title='Material Tree - Wiki'>
                <WikiMaterialsTree />
              </DocumentTitle>
            ),
          }),
        ],
      },
      {
        path: 'setup',
        element: (
          <DocumentTitle title='Setup - Noita Explorer'>
            <CardPageTemplate returnPath={pages.main}>
              <Outlet />
            </CardPageTemplate>
          </DocumentTitle>
        ),
        children: [
          ...addIf(Boolean(noitaAPI.environment.desktop), [
            { path: 'desktop-paths', element: <SetupDesktopPaths /> },
            { path: 'desktop-scrape', element: <SetupDesktopScraper /> },
          ]),
          ...addIf(Boolean(noitaAPI.environment.web), {
            path: 'web-paths',
            element: <SetupWebPaths />,
          }),
        ],
      },
      {
        path: 'holidays',
        element: (
          <DocumentTitle title='Holidays - Noita Explorer'>
            <CardPageTemplate returnPath={pages.main}>
              <NoitaHolidays />
            </CardPageTemplate>
          </DocumentTitle>
        ),
      },
      {
        path: 'current-run',
        element: (
          <DocumentTitle title='Current Run - Noita Explorer'>
            <CardPageTemplate returnPath={pages.main}>
              <CurrentRun />
            </CardPageTemplate>
          </DocumentTitle>
        ),
      },
      {
        path: 'sessions',
        element: (
          <DocumentTitle title='Sessions - Noita Explorer'>
            <EmptyPageTemplate returnPath={pages.main}>
              <NoitaSessions />
            </EmptyPageTemplate>
          </DocumentTitle>
        ),
      },
      {
        path: 'death-map',
        element: (
          <DocumentTitle title='Death Map - Noita Explorer'>
            <CardPageTemplate returnPath={pages.main}>
              <NoitaDeathMap />
            </CardPageTemplate>
          </DocumentTitle>
        ),
      },
      {
        path: 'bones-wands',
        element: (
          <DocumentTitle title='Bones Wands - Noita Explorer'>
            <CardPageTemplate returnPath={pages.main}>
              <NoitaBonesWands />
            </CardPageTemplate>
          </DocumentTitle>
        ),
      },
      {
        path: 'settings',
        element: (
          <DocumentTitle title='Settings - Noita Explorer'>
            <Outlet />
          </DocumentTitle>
        ),
        children: [
          {
            path: '',
            element: (
              <CardPageTemplate returnPath={pages.main}>
                <Settings />
              </CardPageTemplate>
            ),
          },
          {
            path: 'cursor-wand-picker',
            element: (
              <CardPageTemplate returnPath={pages.settings.index}>
                <SettingsCursorWandPicker />
              </CardPageTemplate>
            ),
          },
        ],
      },
      {
        path: 'credits',
        element: (
          <DocumentTitle title='Credits - Noita Explorer'>
            <CardPageTemplate returnPath={pages.main}>
              <Credits />
            </CardPageTemplate>
          </DocumentTitle>
        ),
      },
      ...addIf(__ENV__ !== 'production', {
        path: 'sandbox',
        element: <Sandbox />,
        ssg: false,
        sitemap: false,
      }),
    ],
  },
];

export const browserRouter = createBrowserRouter(routes);

function addIf<T>(condition: boolean, obj: T | T[]): T[] {
  if (!condition) {
    return [];
  }

  if (Array.isArray(obj)) {
    return obj;
  }
  return [obj];
}
