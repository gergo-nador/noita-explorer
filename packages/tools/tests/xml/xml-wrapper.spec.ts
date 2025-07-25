import { describe, it, expect, beforeEach } from '@jest/globals';
import { parseXml } from '../../src/xml/xml-converter';
import { XmlWrapper } from '../../src/xml/xml-wrapper';
import { XmlWrapperType } from '../../src/xml/xml-wrapper.type';

describe('XmlWrapper', () => {
  let xmlWrapper: XmlWrapperType;

  beforeEach(async () => {
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
            <empty hello="2"></empty>
            <modify attr_to_modify="unmodified"></modify>
          </attributes>
          <text>
            <text_simple>Test text</text_simple>
            <text_advanced><node1></node1>Test text<node2></node2></text_advanced>
          </text>
          <sorting>
            <sort_item value="4"></sort_item>
            <sort_item value="3"></sort_item>
            <sort_item value="1"></sort_item>
            <sort_item value="6"></sort_item>
            <sort_item value="2"></sort_item>
            <sort_item value="5"></sort_item>
          </sorting>
          <children_element_test value="1" test="2">
            <child1>Hello</child1>
            <child2 data-value="3"/>
            Text content
            <child3>What</child3>
          </children_element_test>
          <children_remove_test>
            <child1_remove data-testid="1"></child1_remove>
            <child2_remove data-testid="2"></child2_remove>
            <child2_remove data-testid="3"></child2_remove>
            <child2_remove data-testid="4"></child2_remove>
            <child3_remove data-testid="5"></child3_remove>
            <child2_remove data-testid="6"></child2_remove>
          </children_remove_test>
          <many_attributes attr1="1" attr2="test" attr3="ola"></many_attributes>
          <zero_attributes></zero_attributes>
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

  it('should throw when getRequiredAttribute.asFloat is not a float', () => {
    const float11d1 = xmlWrapper.findNthTag('float_11d1');
    expect(float11d1.getRequiredAttribute('value').asFloat()).toBe(11.1);

    const call = () => float11d1.getRequiredAttribute('text_hello').asFloat();
    expect(call).toThrow();
  });

  it('should throw when getRequiredAttribute.asFloat is not a float', () => {
    const float11d1 = xmlWrapper.findNthTag('float_11d1');
    expect(float11d1.getRequiredAttribute('value').asFloat()).toBe(11.1);

    const textHello = xmlWrapper.findNthTag('text_hello');
    const textAttribute = textHello.getRequiredAttribute('value');
    expect(textAttribute).toBeTruthy();

    const call = () => textAttribute.asFloat();
    expect(call).toThrow();
  });

  it('should throw when getRequiredAttribute.asInt is not a int', () => {
    const int111 = xmlWrapper.findNthTag('int_111');
    expect(int111.getRequiredAttribute('value').asInt()).toBe(111);

    const textHello = xmlWrapper.findNthTag('text_hello');
    const textAttribute = textHello.getRequiredAttribute('value');
    expect(textAttribute).toBeTruthy();

    const call = () => textAttribute.asInt();
    expect(call).toThrow();
  });

  it('should get text content of a node', () => {
    const textSimple = xmlWrapper.findNthTag('text_simple');
    expect(textSimple.getTextContent()).toBe('Test text');

    const textAdvanced = xmlWrapper.findNthTag('text_advanced');
    expect(textAdvanced.getTextContent()).toBe('Test text');
  });

  it('should get all children elements', () => {
    const childrenElementTest = xmlWrapper.findNthTag('children_element_test');
    expect(childrenElementTest).toBeTruthy();

    const childrenElementNames = childrenElementTest.getAllChildren();
    expect(Object.keys(childrenElementNames)).toStrictEqual([
      'child1',
      'child2',
      'child3',
    ]);
  });

  it('should get all attributes <many_attributes>', () => {
    const manyAttributes = xmlWrapper.findNthTag('many_attributes');
    expect(manyAttributes.getAllAttributes()).toStrictEqual({
      attr1: '1',
      attr2: 'test',
      attr3: 'ola',
    });
  });

  it('should get all attributes <zero_attributes>', () => {
    const zeroAttributes = xmlWrapper.findNthTag('zero_attributes');
    expect(zeroAttributes.getAllAttributes()).toStrictEqual({});
  });

  it('should add a new attribute', () => {
    const empty = xmlWrapper.findNthTag('empty');
    empty.setAttribute('added', 'hello');

    expect(empty.getAttribute('added')?.asText()).toBe('hello');
  });

  it('should modify an existing attribute', () => {
    const empty = xmlWrapper.findNthTag('modify');
    empty.setAttribute('attr_to_modify', 'done');

    expect(empty.getAttribute('attr_to_modify')?.asText()).toBe('done');
  });

  it('should add a new tag with existing siblings with same tag', () => {
    const third = xmlWrapper.findNthTag('third');
    const newChild = third.addNewChild('second');
    expect(third.findTagArray('second')).toHaveLength(2);

    newChild.setAttribute('id', 'second-4');

    const findNewChild = xmlWrapper
      .findAllTags('second')
      .find((tag) => tag.getAttribute('id')?.asText() === 'second-4');

    expect(findNewChild).toBeTruthy();
  });

  it('should add a new tag without any existing siblings with same tag', () => {
    const third = xmlWrapper.findNthTag('third');
    const newChild = third.addNewChild('newtag');
    expect(third.findTagArray('newtag')).toHaveLength(1);

    newChild.setAttribute('hello', 'test');

    const findNewChild = xmlWrapper.findNthTag('newtag');
    expect(findNewChild).toBeTruthy();
    expect(findNewChild.getAttribute('hello')?.asText()).toBe('test');
  });

  it('should sort items', () => {
    const sort = xmlWrapper.findNthTag('sorting');
    sort.sortChildrenArray('sort_item', (xml1, xml2) => {
      const val1 = xml1.getAttribute('value').asInt();
      const val2 = xml2.getAttribute('value').asInt();

      return val1 - val2;
    });

    const sortedItems = xmlWrapper.findTagArray('sort_item');

    expect(sortedItems).toHaveLength(6);

    expect(sortedItems[0].getAttribute('value').asInt()).toBe(1);
    expect(sortedItems[1].getAttribute('value').asInt()).toBe(2);
    expect(sortedItems[2].getAttribute('value').asInt()).toBe(3);
    expect(sortedItems[3].getAttribute('value').asInt()).toBe(4);
    expect(sortedItems[4].getAttribute('value').asInt()).toBe(5);
    expect(sortedItems[5].getAttribute('value').asInt()).toBe(6);
  });

  it('should throw when trying to remove root', () => {
    expect(() => xmlWrapper.remove()).toThrow();
  });

  it('should remove child1', () => {
    const childRemoveTest = xmlWrapper.findNthTag('children_remove_test');

    // pre-check
    expect(xmlWrapper.findNthTag('child1_remove')).toBeTruthy();

    childRemoveTest.findNthTag('child1_remove').remove();

    // post-check
    expect(xmlWrapper.findNthTag('child1_remove')).toBeUndefined();
  });

  it('should remove child2 data-testid="2"', () => {
    const childRemoveTest = xmlWrapper.findNthTag('children_remove_test');

    // pre-check
    const child2BeforeRemoveTestId = xmlWrapper
      .findNthTag('child2_remove')
      .getRequiredAttribute('data-testid')
      .asText();
    expect(child2BeforeRemoveTestId).toBe('2');
    expect(childRemoveTest.findTagArray('child2_remove').length).toBe(4);

    childRemoveTest.findNthTag('child2_remove').remove();

    // post-check
    const child2AfterRemoveTestId = xmlWrapper
      .findNthTag('child2_remove')
      .getRequiredAttribute('data-testid')
      .asText();
    expect(child2AfterRemoveTestId).toBe('3');
    expect(childRemoveTest.findTagArray('child2_remove').length).toBe(3);
  });

  it('should remove child2 data-testid="3"', () => {
    const childRemoveTest = xmlWrapper.findNthTag('children_remove_test');

    // pre-check
    expect(childRemoveTest.findTagArray('child2_remove').length).toBe(4);

    const child2ToBeRemoved = xmlWrapper
      .findTagArray('child2_remove')
      .find((x) => x.getAttribute('data-testid').asText() === '3');

    child2ToBeRemoved.remove();

    // post-check
    const child2AfterRemoveTestId = xmlWrapper
      .findNthTag('child2_remove')
      .getRequiredAttribute('data-testid')
      .asText();
    expect(child2AfterRemoveTestId).toBe('2');
    expect(childRemoveTest.findTagArray('child2_remove').length).toBe(3);
  });
});
