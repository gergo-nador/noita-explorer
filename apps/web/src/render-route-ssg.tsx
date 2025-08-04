import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext,
  StaticRouterProvider,
} from 'react-router-dom';
import { routes } from './routes/router.tsx';
import { renderToString } from 'react-dom/server.browser';
import { Head } from '@noita-explorer/react-utils';
import './index.css';

export const renderRouteSsg = async (url: string) => {
  const handler = createStaticHandler(routes);
  const context = (await handler.query(
    new Request(url),
  )) as StaticHandlerContext;

  const router = createStaticRouter(routes, context);

  const html = renderToString(
    <html>
      <body>
        <StaticRouterProvider router={router} context={context} />
        <Head>
          <Head.Meta property='og:site_name' content='Noita Explorer' />
          <Head.Meta name='application-name' content='Noita Explorer' />

          <Head.Meta
            name='description'
            content='Noita Explorer helps you unlock your lost in-game progress without mods. Unlock spells, enemies, perks, achievement pillars, crown, amulet, and so on...'
          />

          <Head.Meta
            name='keywords'
            content='noita,unlock,progress,game progress,unlock progress'
          />

          <Head.Meta property='og:type' content='website' />
        </Head>
      </body>
    </html>,
  );

  return html;
};
