import { JSDOM } from 'jsdom';

export function removePreloadLinks(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const preloadLinks = document.querySelectorAll('link[rel=preload][as=image]');
  preloadLinks.forEach((link) => link.parentElement.removeChild(link));

  const serializedHtml = dom.serialize();

  dom.window.close();

  return serializedHtml;
}
