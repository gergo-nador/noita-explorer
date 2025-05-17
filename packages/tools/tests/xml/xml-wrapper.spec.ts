import { describe, it, expect, beforeAll } from '@jest/globals';
import { XmlWrapperType } from '../../src/xml/interfaces/xml-wrapper-type';
import { parseXml } from '../../src/xml/xml-converter';
import { XmlWrapper } from '../../src/xml/xml-wrapper';

describe('XmlWrapper', () => {
  let xmlWrapper: XmlWrapperType;

  beforeAll(async () => {
    const xml = `
        <root>
          <first>
            <second id="second-1">1</second>
            <second id="second-2">Text</second>
          </first>
          <third>
            <second id="second-3">Phone</second>
          </third>
          <attributes>
            <bool>
              <bool_0 value="0" />
              <bool_false value="false" />
              <bool_whatever value="whatever" />
              <bool_1 value="1" />
              <bool_true value="true" />
            </bool>
            <text>
              <text_123 value="123" />
              <text_hello value="hello" />
            </text>
            <int>
              <int_0 value="0" />
              <int_m1 value="-1" />
              <int_1 value="1" />
              <int_111 value="111" />
              <int_11d1 value="11.1" />
            </int>
            <float>
              <float_0 value="0" />
              <float_11d1 value="11.1" />
              <float_22d234234 value="22.234234" />
            </float>
          </attributes>
        </root>
      `;

    const xmlObj = await parseXml(xml);
    xmlWrapper = XmlWrapper(xmlObj);
  });

  it('should pass', () => {
    expect(1).toBe(1);
  });

  it('should be truthy', () => {
    expect(xmlWrapper).toBeTruthy();
  });

  it('should findNthTag "second" from "root"', () => {
    const tag = xmlWrapper.findNthTag('second');
    expect(tag).toBeTruthy();
    expect(tag.getAttribute('id').asText()).toBe('second-1');

    const tag1 = xmlWrapper.findNthTag('second', 1);
    expect(tag1).toBeTruthy();
    expect(tag1.getAttribute('id').asText()).toBe('second-2');

    const getIndex2Tag = () => xmlWrapper.findNthTag('second', 2);
    expect(getIndex2Tag).toThrow();
  });

  it('should findTagArray "second" from "root"', () => {
    const tags = xmlWrapper.findTagArray('second');
    expect(tags).toHaveLength(2);

    const tag1 = tags[0];
    expect(tag1.getAttribute('id').asText()).toBe('second-1');

    const tag2 = tags[1];
    expect(tag2.getAttribute('id').asText()).toBe('second-2');
  });

  it('should findAllTags "second" from "root"', () => {
    const tags = xmlWrapper.findAllTags('second');
    expect(tags).toHaveLength(3);

    const tag1 = tags[0];
    expect(tag1.getAttribute('id').asText()).toBe('second-1');

    const tag2 = tags[1];
    expect(tag2.getAttribute('id').asText()).toBe('second-2');

    const tag3 = tags[2];
    expect(tag3.getAttribute('id').asText()).toBe('second-3');
  });

  it('should getAttribute bool', () => {
    const bool = xmlWrapper.findNthTag('bool');
    expect(bool.getAttribute('nonexistent')?.asBoolean()).toBe(undefined);

    const bool0 = xmlWrapper.findNthTag('bool_0');
    expect(bool0.getAttribute('value').asBoolean()).toBe(false);

    const boolFalse = xmlWrapper.findNthTag('bool_false');
    expect(boolFalse.getAttribute('value').asBoolean()).toBe(false);

    const boolWhatever = xmlWrapper.findNthTag('bool_whatever');
    expect(boolWhatever.getAttribute('value').asBoolean()).toBe(false);

    const bool1 = xmlWrapper.findNthTag('bool_1');
    expect(bool1.getAttribute('value').asBoolean()).toBe(true);

    const boolTrue = xmlWrapper.findNthTag('bool_true');
    expect(boolTrue.getAttribute('value').asBoolean()).toBe(true);
  });

  it('should getAttribute asText', () => {
    const text = xmlWrapper.findNthTag('text');
    expect(text.getAttribute('nonexistent')?.asText()).toBe(undefined);

    const text123 = xmlWrapper.findNthTag('text_123');
    expect(text123.getAttribute('value').asText()).toBe('123');

    const textHello = xmlWrapper.findNthTag('text_hello');
    expect(textHello.getAttribute('value').asText()).toBe('hello');
  });

  it('should getAttribute asInt', () => {
    const int = xmlWrapper.findNthTag('int');
    expect(int.getAttribute('nonexistent')?.asInt()).toBe(undefined);

    const intM1 = xmlWrapper.findNthTag('int_m1');
    expect(intM1.getAttribute('value').asInt()).toBe(-1);

    const int0 = xmlWrapper.findNthTag('int_0');
    expect(int0.getAttribute('value').asInt()).toBe(0);

    const int1 = xmlWrapper.findNthTag('int_1');
    expect(int1.getAttribute('value').asInt()).toBe(1);

    const int111 = xmlWrapper.findNthTag('int_111');
    expect(int111.getAttribute('value').asInt()).toBe(111);

    const int11d1 = xmlWrapper.findNthTag('int_11d1');
    expect(int11d1.getAttribute('value').asInt()).toBe(11);
  });

  it('should getAttribute asFloat', () => {
    const float = xmlWrapper.findNthTag('float');
    expect(float.getAttribute('nonexistent')?.asFloat()).toBe(undefined);

    const float0 = xmlWrapper.findNthTag('float_0');
    expect(float0.getAttribute('value').asFloat()).toBe(0);

    const float11d1 = xmlWrapper.findNthTag('float_11d1');
    expect(float11d1.getAttribute('value').asFloat()).toBe(11.1);

    const float22d234234 = xmlWrapper.findNthTag('float_22d234234');
    expect(float22d234234.getAttribute('value').asFloat()).toBe(22.234234);
  });

  it('should throw when getRequiredAttribute cannot find an attribute', () => {
    const second = xmlWrapper.findNthTag('second');

    expect(second.getRequiredAttribute('id').asText()).toBe('second-1');

    const call = () => second.getRequiredAttribute('nonexistent').asText();
    expect(call).toThrow();
  });

  it('should get text content of a node', () => {
    const secondNodes = xmlWrapper.findAllTags('second');

    const second1 = secondNodes[0];
    expect(second1.getTextContent()).toBe('1');

    const second2 = secondNodes[1];
    expect(second2.getTextContent()).toBe('Text');

    const second3 = secondNodes[2];
    expect(second3.getTextContent()).toBe('Phone');
  });
});
