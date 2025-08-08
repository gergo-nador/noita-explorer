import React from 'react';
import { renderToString } from 'react-dom/server.browser';
import { HtmlDoc } from '../../src/html-doc';

export const renderRawHtmlFile = () => {
  const html = renderToString(
    <HtmlDoc>
      <HtmlDoc.Root />
      <HtmlDoc.MainScript tsx={true} />
    </HtmlDoc>,
  );
  return '<!DOCTYPE html>' + html;
};
