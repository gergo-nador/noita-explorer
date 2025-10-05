import { createBrowserRouter, Outlet } from 'react-router-dom';
import { SeoDefaultPage } from '@noita-explorer/react-utils';
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
import { NoitaDeathMap } from '../pages/death-map/noita-death-map.tsx';
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
import { WikiSpellDetails } from '../pages/wiki/spells/wiki-spell-details.tsx';
import { WikiEnemyDetails } from '../pages/wiki/enemies/wiki-enemy-details.tsx';
import { WikiMaterialDetails } from '../pages/wiki/materials/wiki-material-details.tsx';

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
          <>
            <SeoDefaultPage
              title='Noita Explorer'
              description='Noita Explorer helps you unlock your lost in-game progress without mods. Unlock spells, enemies, perks, achievement pillars, crown, amulet, and so on...'
            />
            <MainPage />
          </>
        ),
      },
      {
        path: 'progress-tracker',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: (
              <>
                <SeoDefaultPage
                  title='Progress Tracker'
                  description='See your in-game progress, and unlock any perk, spell or enemy.'
                />
                <CardPageTemplate returnPath={pages.main}>
                  <NoitaProgressTracker />
                </CardPageTemplate>
              </>
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
                  <>
                    <SeoDefaultPage
                      title='Secrets - Progress Tracker'
                      description='Shhhhh. You might spoiler it for yourself'
                    />
                    <NoitaProgressTrackerSecrets />
                  </>
                ),
              },
              {
                path: 'pillar',
                element: (
                  <>
                    <SeoDefaultPage
                      title='Achievement Pillar - Progress Tracker'
                      description='Check your unlocked achievements progress, and unlock any of the pillars'
                    />
                    <NoitaProgressTrackerPillar />
                  </>
                ),
              },
            ],
          },
        ],
      },
      {
        path: 'wiki',
        ssg: false,
        sitemap: false,
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
            element: <WikiPerks />,
            children: [
              {
                path: '',
                element: (
                  <>
                    <SeoDefaultPage
                      title='Perks - Wiki'
                      description='Browse any in-game perk.'
                    />
                    <div>Select a perk</div>
                  </>
                ),
              },
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
            element: <WikiSpells />,
            children: [
              {
                path: '',
                element: (
                  <>
                    <SeoDefaultPage
                      title='Spells - Wiki'
                      description='Browse any in-game spell.'
                    />
                    <div>Select a spell</div>
                  </>
                ),
              },
              {
                path: ':spellId',
                element: <WikiSpellDetails />,
                getAllDynamicParams: () => {
                  const spellIds = noitaDataWakStore
                    .getState()
                    .data?.spells?.map((spell) => spell.id);

                  if (spellIds === undefined) {
                    return [];
                  }

                  return spellIds;
                },
              },
            ],
          },
          {
            path: 'enemies',
            element: <WikiEnemies />,
            children: [
              {
                path: '',
                element: (
                  <>
                    <SeoDefaultPage
                      title='Enemies - Wiki'
                      description='Browse any in-game enemy.'
                    />
                    <div>Select an enemy</div>
                  </>
                ),
              },
              {
                path: ':enemyId',
                element: <WikiEnemyDetails />,
                getAllDynamicParams: () => {
                  const enemyIds = noitaDataWakStore
                    .getState()
                    .data?.enemies?.map((enemy) => enemy.id);

                  if (enemyIds === undefined) {
                    return [];
                  }

                  return enemyIds;
                },
              },
            ],
          },
          {
            path: 'materials',
            ssg: false,
            element: <WikiMaterials />,
            children: [
              {
                path: '',
                element: (
                  <>
                    <SeoDefaultPage
                      title='Materials - Wiki'
                      description='Browse any in-game material.'
                    />
                    <div>Select a material</div>
                  </>
                ),
              },
              {
                path: ':materialId',
                element: <WikiMaterialDetails />,
                getAllDynamicParams: () => {
                  const materialIds = noitaDataWakStore
                    .getState()
                    .data?.materials?.map((material) => material.id);

                  if (materialIds === undefined) {
                    return [];
                  }

                  return materialIds;
                },
              },
            ],
          },
          ...addIf(__ENV__ !== 'production', {
            path: 'materials-tree',
            element: (
              <>
                <SeoDefaultPage
                  title='Material Tree - Wiki'
                  description='Show the relations between the materials.'
                />
                <WikiMaterialsTree />
              </>
            ),
          }),
        ],
      },
      {
        path: 'setup',
        element: (
          <>
            <SeoDefaultPage
              title='Setup'
              description='Set up your in-game folder to continue.'
            />
            <CardPageTemplate returnPath={pages.main}>
              <Outlet />
            </CardPageTemplate>
          </>
        ),
        ssg: false,
        sitemap: false,
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
          <>
            <SeoDefaultPage
              title='Noita Holidays'
              description='View upcoming in-game holidays in the Noita Holiday Calendar.'
            />
            <CardPageTemplate returnPath={pages.main}>
              <NoitaHolidays />
            </CardPageTemplate>
          </>
        ),
      },
      ...addIf(__ENV__ !== 'production', {
        path: 'current-run',
        element: (
          <>
            <SeoDefaultPage
              title='Current Run'
              description='Check your current run'
            />
            <CardPageTemplate returnPath={pages.main}>
              <CurrentRun />
            </CardPageTemplate>
          </>
        ),
      }),
      {
        path: 'sessions',
        element: (
          <>
            <SeoDefaultPage
              title='Sessions'
              description='View your previous sessions, find out how many times did you die because of explosion, and check out other statistics.'
            />
            <EmptyPageTemplate returnPath={pages.main}>
              <NoitaSessions />
            </EmptyPageTemplate>
          </>
        ),
      },
      {
        path: 'death-map',
        element: (
          <>
            <SeoDefaultPage
              title='Death Map'
              description='Check out your death locations of your previous runs in one map.'
            />
            <CardPageTemplate returnPath={pages.main}>
              <NoitaDeathMap />
            </CardPageTemplate>
          </>
        ),
      },
      {
        path: 'bones-wands',
        element: (
          <>
            <SeoDefaultPage
              title='Bones Wands'
              description="Scared of your old wand builds haunting you? Don't worry no more!"
            />
            <CardPageTemplate returnPath={pages.main}>
              <NoitaBonesWands />
            </CardPageTemplate>
          </>
        ),
      },
      {
        path: 'settings',
        element: <Outlet />,
        children: [
          {
            path: '',
            element: (
              <>
                <SeoDefaultPage
                  title='Settings'
                  description="This is a settings page. Not a lot, but it's honest work."
                />
                <CardPageTemplate returnPath={pages.main}>
                  <Settings />
                </CardPageTemplate>
              </>
            ),
          },
          {
            path: 'cursor-wand-picker',
            element: (
              <>
                <SeoDefaultPage
                  title='Cursor Wand Picker - Settings'
                  description='Pick your favorite wand to use it as a cursor.'
                />
                <CardPageTemplate returnPath={pages.settings.index}>
                  <SettingsCursorWandPicker />
                </CardPageTemplate>
              </>
            ),
          },
        ],
      },
      {
        path: 'credits',
        element: (
          <>
            <SeoDefaultPage
              title='Credits'
              description='A way of saying thank you to the Noita community.'
            />
            <CardPageTemplate returnPath={pages.main}>
              <Credits />
            </CardPageTemplate>
          </>
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
