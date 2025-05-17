import { describe, it, expect } from '@jest/globals';
import { parseXml, toXml } from '../../src/xml/xml-converter';

describe('XmlConverter', () => {
  it('should succeed', () => {
    expect(1).toBe(1);
  });

  it('should parse an xml', async () => {
    const xml = `
      <root id="123" name="rootNode">
        <single>Single item</single>
        <child id="1">Child 1</child>
        <child id="2">Child 2</child>
        <item type="A">Item A</item>
        <item type="B">Item B</item>
        <note lang="en">Note in English</note>
        <note lang="fr">Note en Français</note>
        <childless />
        <childless_attr attr1="1" />
        <childless_extended attr1="1"></childless_extended>
      </root>
    `;

    const parsed = await parseXml(xml);

    expect(parsed).toBeTruthy();
    expect(parsed).toStrictEqual({
      root: {
        $: { id: '123', name: 'rootNode' },
        single: ['Single item'],
        child: [
          {
            _: 'Child 1',
            $: {
              id: '1',
            },
          },
          {
            _: 'Child 2',
            $: {
              id: '2',
            },
          },
        ],
        childless: [''],
        childless_attr: [
          {
            $: {
              attr1: '1',
            },
          },
        ],
        childless_extended: [
          {
            $: {
              attr1: '1',
            },
          },
        ],
        item: [
          {
            _: 'Item A',
            $: {
              type: 'A',
            },
          },
          {
            _: 'Item B',
            $: {
              type: 'B',
            },
          },
        ],
        note: [
          {
            _: 'Note in English',
            $: {
              lang: 'en',
            },
          },
          {
            _: 'Note en Français',
            $: {
              lang: 'fr',
            },
          },
        ],
      },
    });
  });

  it('should parse an xml after removing the comments', async () => {
    const xml = `
      <root id="123" name="rootNode">
        <!-- hello -->
        <single>Single item</single>
        <child id="1">Child 1</child>
        <child id="2">Child 2</child>
        <item type="A">Item A</item>
        <item type="B">Item B</item>
        <note lang="en">Note in English</note>
        <note lang="fr">Note en Français</note>
      </root>
    `;

    const parsed = await parseXml(xml);

    expect(parsed).toBeTruthy();
    expect(parsed).toStrictEqual({
      root: {
        $: { id: '123', name: 'rootNode' },
        single: ['Single item'],
        child: [
          {
            _: 'Child 1',
            $: {
              id: '1',
            },
          },
          {
            _: 'Child 2',
            $: {
              id: '2',
            },
          },
        ],
        item: [
          {
            _: 'Item A',
            $: {
              type: 'A',
            },
          },
          {
            _: 'Item B',
            $: {
              type: 'B',
            },
          },
        ],
        note: [
          {
            _: 'Note in English',
            $: {
              lang: 'en',
            },
          },
          {
            _: 'Note en Français',
            $: {
              lang: 'fr',
            },
          },
        ],
      },
    });
  });

  it('should convert to xml', async () => {
    const xmlObj = {
      root: {
        $: { id: '123', name: 'rootNode' },
        single: ['Single item'],
        child: [
          {
            _: 'Child 1',
            $: {
              id: '1',
            },
          },
          {
            _: 'Child 2',
            $: {
              id: '2',
            },
          },
        ],
        childless: [''],
        childless_attr: [
          {
            $: {
              attr1: '1',
            },
          },
        ],
        childless_extended: [
          {
            $: {
              attr1: '1',
            },
          },
        ],
        item: [
          {
            _: 'Item A',
            $: {
              type: 'A',
            },
          },
          {
            _: 'Item B',
            $: {
              type: 'B',
            },
          },
        ],
        note: [
          {
            _: 'Note in English',
            $: {
              lang: 'en',
            },
          },
          {
            _: 'Note en Français',
            $: {
              lang: 'fr',
            },
          },
        ],
      },
    };

    const text = await toXml(xmlObj);

    expect(text).toBeTruthy();
    expect(text).toBe(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root id="123" name="rootNode">
  <single>Single item</single>
  <child id="1">Child 1</child>
  <child id="2">Child 2</child>
  <childless></childless>
  <childless_attr attr1="1"></childless_attr>
  <childless_extended attr1="1"></childless_extended>
  <item type="A">Item A</item>
  <item type="B">Item B</item>
  <note lang="en">Note in English</note>
  <note lang="fr">Note en Français</note>
</root>`);
  });
});
