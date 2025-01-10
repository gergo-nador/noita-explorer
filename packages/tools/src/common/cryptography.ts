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

function toAsciiBuffer(str: string): Buffer {
  const array = new Uint8Array(str.length);

  for (let i = 0; i < str.length; ++i) {
    array[i] = str.charCodeAt(i);
  }

  return Buffer.from(array);
}

async function aes({
  content,
  iv,
  key,
}: {
  content: Buffer | Uint8Array;
  key: Uint8Array;
  iv: Uint8Array;
}) {
  if (Buffer.isBuffer(content)) {
    content = Buffer.from(content);
  }

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-CTR', length: 128 },
    false,
    ['encrypt', 'decrypt'],
  );

  const result = await crypto.subtle.decrypt(
    {
      name: 'AES-CTR',
      counter: iv,
      length: 128,
    },
    cryptoKey,
    content,
  );

  return {
    asBuffer: () => Buffer.from(result),
    asText: () => {
      const buffer = Buffer.from(result);
      return buffer.toString('utf8');
    },
    asUint8Array: () => new Uint8Array(result),
  };
}

export const cryptographyHelpers = {
  aes: {
    stringToKey,
    toAsciiBuffer,
    blockTransform: aes,
  },
};
