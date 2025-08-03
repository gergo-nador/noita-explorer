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
