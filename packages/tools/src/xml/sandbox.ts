import { toXml } from './xml-converter.ts';

const result = toXml({
  root: {
    text: ['hello', { _: '' }, { _: 'h' }],
  },
});

console.log(result);
