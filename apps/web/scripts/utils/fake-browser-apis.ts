/**
 * Import this file to fake/mock browser provided apis for scripts
 */

import { JSDOM } from 'jsdom';
const dom = new JSDOM(`<!DOCTYPE html><p>Hello</p>`);
import 'fake-indexeddb/auto';

// @ts-expect-error assign mock window
globalThis.window = dom.window;
globalThis.document = dom.window.document;
// @ts-expect-error assign mock localStorage
globalThis.localStorage = {};

Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  configurable: true,
  enumerable: true,
});

if (!('createRequire' in globalThis)) {
  globalThis.createRequire = () => {
    const fakeRequire = (id: string) => {
      throw new Error(
        `Dynamic require() is not supported in this environment. Tried to load: ${id}`,
      );
    };
    return fakeRequire;
  };
}
