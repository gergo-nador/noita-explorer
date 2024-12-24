import { Buffer } from 'buffer';

function stringToKey(str: string): Uint8Array {
  function stringToHex(str: string): string {
    return Array.from(str)
      .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }

  function fromHexString(hexString: string): Uint8Array {
    return new Uint8Array(
      hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
    );
  }

  return fromHexString(stringToHex(str));
}

async function aes({
  content,
  iv,
  key,
}: {
  content: Buffer;
  key: Uint8Array;
  iv: Uint8Array;
}) {
  const key_encoded = await crypto.subtle.importKey(
    'raw',
    key,
    'AES-CTR',
    false,
    ['encrypt', 'decrypt'],
  );

  const result = await crypto.subtle.decrypt(
    {
      name: 'AES-CTR',
      counter: iv,
      length: 128,
    },
    key_encoded,
    content,
  );

  return {
    asBuffer: () => Buffer.from(result),
    asText: () => {
      const buffer = Buffer.from(result);
      return buffer.toString('utf8');
    },
  };
}
/*
function toAscii(str: string): Buffer {
  const array = new Uint8Array(str.length);

  for (let i = 0; i < str.length; ++i) {
    array[i] = str.charCodeAt(i);
  }

  return Buffer.from(array);
}*/

export async function aesBuffer({
  key,
  iv,
  buffer,
}: {
  buffer: Buffer;
  key: string;
  iv: string;
}) {
  const result = await aes({
    content: buffer,
    key: stringToKey(key),
    iv: stringToKey(iv),
  });

  return result.asText();
}
/*const key = stringToKey('WhenYouHaveNothingLeftToSeek'.slice(0, 16));
const iv = stringToKey('PeopleWillRejoiceAndDance'.slice(0, 16));

const content = fs.readFileSync('data.wak');

aes({
  content: content,
  key: key,
  iv: iv,
}).then((result) => {
  const buff = result.asBuffer();

  fs.writeFileSync('data.zip', buff);
  aes({
    content: Buffer.from(toAscii(text)),
    key: key,
    iv: iv,
  }).then((result) => {
    const buff = result.asBuffer();
  });
});*/
