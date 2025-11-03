import { Buffer } from 'buffer';

type CopyableBuffer = ArrayBuffer | SharedArrayBuffer | Buffer;

function copy(source: CopyableBuffer, dest: CopyableBuffer) {
  let sourceBuffer: ArrayLike<number> | ArrayBuffer | SharedArrayBuffer;
  if (source instanceof ArrayBuffer) {
    sourceBuffer = source;
  } else if (source instanceof SharedArrayBuffer) {
    sourceBuffer = source;
  } else if (source instanceof Buffer) {
    sourceBuffer = source.buffer;
  } else {
    throw new Error('unknow buffer type for source buffer');
  }

  let destBuffer: ArrayLike<number> | ArrayBuffer | SharedArrayBuffer;
  if (dest instanceof ArrayBuffer) {
    destBuffer = dest;
  } else if (dest instanceof SharedArrayBuffer) {
    destBuffer = dest;
  } else if (dest instanceof Buffer) {
    destBuffer = dest.buffer;
  } else {
    throw new Error('unknow buffer type for destination buffer');
  }

  new Uint8Array(destBuffer).set(new Uint8Array(sourceBuffer));
}

export const bufferHelpers = { copy };
