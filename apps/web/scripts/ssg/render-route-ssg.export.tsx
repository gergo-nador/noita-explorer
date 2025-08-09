import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext,
  StaticRouterProvider,
} from 'react-router-dom';
import { renderToString } from 'react-dom/server.browser';

import '../../src/index.css';
import { routes } from '../../src/routes/router';
import { App } from '../../src/app';
import { HtmlDoc } from '../../src/html-doc';
import { deployUrls } from '../../src/utils/deploy-urls';

export { noitaDataWakStore } from '../../src/stores/noita-data-wak';

export const renderRouteSsg = async (path: string) => {
  const url = deployUrls.noitaExplorer.production + path;

  const handler = createStaticHandler(routes);
  const context = (await handler.query(
    new Request(url),
  )) as StaticHandlerContext;

  const router = createStaticRouter(routes, context);

  const html = renderToString(
    <HtmlDoc canonicalUrl={url}>
      <HtmlDoc.Root>
        <App>
          <StaticRouterProvider router={router} context={context} />
        </App>
      </HtmlDoc.Root>
      <HtmlDoc.MainScript tsx={false} />
    </HtmlDoc>,
  );

  return '<!DOCTYPE html>' + html;
};
