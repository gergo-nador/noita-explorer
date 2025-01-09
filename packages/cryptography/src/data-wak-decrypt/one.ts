/***************************************************************
 * Example universal function. In Node, uses crypto.createDecipheriv;
 * in a browser, tries window.crypto.subtle
 *
 * NOTE: This is a demonstration. Production usage might differ.
 ***************************************************************/
function isNodeEnv(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  );
}

export async function decryptBlockAES128CTR(
  key: Uint8Array,
  iv: Uint8Array,
  input: Uint8Array,
): Promise<Uint8Array> {
  if (isNodeEnv()) {
    // Node path (synchronous)
    const nodeCrypto = await import('crypto');
    const decipher = nodeCrypto.createDecipheriv('aes-128-ctr', key, iv);
    const out = Buffer.concat([decipher.update(input), decipher.final()]);
    return new Uint8Array(out);
  } else {
    // Browser path (async)
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-CTR', length: 128 },
      false,
      ['encrypt', 'decrypt'],
    );
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-CTR',
        counter: iv,
        length: 128,
      },
      cryptoKey,
      input,
    );
    return new Uint8Array(decrypted);
  }
}
