import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext,
  StaticRouterProvider,
} from 'react-router-dom';
import { routes } from '../../src/routes/router';
import { renderToString } from 'react-dom/server.browser';
import '../../src/index.css';

export const renderRouteSsg = async (path: string) => {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  const url = 'https://noita-explorer.com' + path;

  const handler = createStaticHandler(routes);
  const context = (await handler.query(
    new Request(url),
  )) as StaticHandlerContext;

  const router = createStaticRouter(routes, context);

  const html = renderToString(
    <html>
      <head>
        <meta charSet='UTF-8' />
        <link rel='icon' type='image/png' href='/favicon.png' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Noita Explorer</title>
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='Noita Explorer' />
        <meta property='application-name' content='Noita Explorer' />
        <meta
          name='description'
          content='Noita Explorer helps you unlock your lost in-game progress without mods. Unlock spells, enemies, perks, achievement pillars, crown, amulet, and so on...'
        />
        <meta
          name='keywords'
          content='noita,unlock,progress,game progress,unlock progress'
        />
        <link rel='canonical' href={url} />
        <meta
          name='google-site-verification'
          content='pC4tL9YCkPCuXtbGTraiIcDlsFQntUuwn17pNtr01Ek'
        />
        <style
          dangerouslySetInnerHTML={{
            __html: 'html { background-color: #000000; }',
          }}
        />
        <link rel='stylesheet' href='/assets/index.css' />
      </head>
      <body>
        <StaticRouterProvider router={router} context={context} />
      </body>
    </html>,
  );

  return html;
};
