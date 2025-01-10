import { cryptographyHelpers } from '@noita-explorer/tools';
import { Buffer } from 'buffer';

interface DecryptSalakieliProps {
  buffer: Buffer | Uint8Array;
  key: string;
  iv: string;
}

const decryptSalakieli = async ({ key, iv, buffer }: DecryptSalakieliProps) => {
  const result = await cryptographyHelpers.aes.blockTransform({
    content: Buffer.from(buffer),
    key: cryptographyHelpers.aes.stringToKey(key),
    iv: cryptographyHelpers.aes.stringToKey(iv),
  });

  return result.asText();
};

interface EncryptSalakieliProps {
  text: string;
  key: string;
  iv: string;
}

const encryptSalakieli = async ({ key, iv, text }: EncryptSalakieliProps) => {
  const buffer = cryptographyHelpers.aes.toAsciiBuffer(text);
  const result = await cryptographyHelpers.aes.blockTransform({
    content: buffer,
    key: cryptographyHelpers.aes.stringToKey(key),
    iv: cryptographyHelpers.aes.stringToKey(iv),
  });

  return result.asBuffer();
};

export const cryptoSalakieli = {
  decrypt: decryptSalakieli,
  encrypt: encryptSalakieli,
};
