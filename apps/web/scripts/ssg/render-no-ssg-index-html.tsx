import React from 'react';

import { HtmlDoc } from '../../src/html-doc';
import { renderToString } from 'react-dom/server.browser';

export const renderNoSsgIndexHtml = (canonicalUrl: string) => {
  const html = renderToString(
    <HtmlDoc canonicalUrl={canonicalUrl}>
      <HtmlDoc.Root></HtmlDoc.Root>
      <HtmlDoc.MainScript tsx={false} />
    </HtmlDoc>,
  );

  return '<!DOCTYPE html>' + html;
};
