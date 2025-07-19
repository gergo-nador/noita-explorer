import { describe, it, expect } from '@jest/globals';
import { parseXml, toXmlString } from '../../src/xml/xml-converter';
import { XmlRootDeclaration } from '../../src/xml/interfaces/xml-root-declaration';
import { xmlPostProcess } from '../../src/xml/xml-processing/xml-post-process';

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

    let parsed = await parseXml(xml);
    parsed = xmlPostProcess(parsed);

    expect(parsed).toBeTruthy();
    expect(parsed).toStrictEqual({
      root: {
        $: { id: '123', name: 'rootNode' },
        single: [{ _: 'Single item' }],
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
        childless: [
          {
            _: '',
          },
        ],
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

  it('should ignore second root', async () => {
    const xml = `
      <root>
        <hello attr1="1">Whatsup<childless/></hello>
      </root>
      <root2>
        <other>ohh</other>
      </root2>
    `;

    let parsed = await parseXml(xml);
    parsed = xmlPostProcess(parsed);

    expect(parsed).toBeTruthy();
    expect(parsed).toStrictEqual({
      root: {
        hello: [
          {
            _: 'Whatsup',
            $: { attr1: '1' },
            childless: [
              {
                _: '',
              },
            ],
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
        <single1><childless/></single1>
        <child id="1">Child 1</child>
        <child id="2">Child 2</child>
        <item type="A">Item A</item>
        <item type="B">Item B</item>
        <note lang="en">Note in English</note>
        <note lang="fr">Note en Français</note>
      </root>
    `;

    let parsed = await parseXml(xml);
    parsed = xmlPostProcess(parsed);

    expect(parsed).toBeTruthy();
    expect(parsed).toStrictEqual({
      root: {
        $: { id: '123', name: 'rootNode' },
        single: [{ _: 'Single item' }],
        single1: [
          {
            childless: [
              {
                _: '',
              },
            ],
          },
        ],
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
        single: [{ _: 'Single item' }],
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
        childless: [{ _: '' }],
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
    } as unknown as XmlRootDeclaration;

    const text = toXmlString(xmlObj);

    expect(text).toBeTruthy();
    expect(text).toBe(`<root id="123" name="rootNode">
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
