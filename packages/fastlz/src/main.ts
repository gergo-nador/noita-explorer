import createModule, { ImportModule } from './wrapper/fastlz-single';
import { Buffer } from 'buffer';

export interface FastLZCompressor {
  decompressUint8Array: (
    input: Uint8Array,
    maxOutputSize?: number,
  ) => Uint8Array;
  decompressBuffer: (input: Buffer, maxOutputSize?: number) => Buffer;
}

export async function createFastLzCompressor(): Promise<FastLZCompressor> {
  const module = await createModule();

  return {
    decompressUint8Array: (input: Uint8Array, maxOutputSize?: number) =>
      decompress({ module, input, maxOutputSize }),
    decompressBuffer: (input: Buffer, maxOutputSize?: number) =>
      decompressBuffer({ module, input, maxOutputSize }),
  };
}

function decompress({
  module,
  input,
  maxOutputSize,
}: {
  module: ImportModule;
  input: Uint8Array;
  maxOutputSize?: number;
}): Uint8Array {
  const fastlzDecompress = module.cwrap('fastlz_decompress', 'number', [
    'number',
    'number',
    'number',
    'number',
  ]);

  if (maxOutputSize === undefined) {
    // this should be enough for fastlz
    maxOutputSize = input.length * 30;
  }

  // allocate memory
  const inputPtr = module._malloc(input.length);
  const outputPtr = module._malloc(maxOutputSize);

  try {
    // copy input data to WASM memory
    module.HEAPU8.set(input, inputPtr);

    const decompressedSize = fastlzDecompress(
      inputPtr,
      input.length,
      outputPtr,
      maxOutputSize,
    );

    if (decompressedSize === 0) {
      throw new Error(
        'Decompression failed. Data may be corrupted or output buffer too small.',
      );
    }

    // copy decompressed data from WASM memory
    const result = new Uint8Array(decompressedSize);
    result.set(module.HEAPU8.subarray(outputPtr, outputPtr + decompressedSize));

    return result;
  } finally {
    // free allocated memory
    module._free(inputPtr);
    module._free(outputPtr);
  }
}

function decompressBuffer({
  module,
  input,
  maxOutputSize,
}: {
  module: ImportModule;
  input: Buffer;
  maxOutputSize?: number;
}): Buffer {
  const uintArray = new Uint8Array(input);
  const output = decompress({ module, input: uintArray, maxOutputSize });

  return Buffer.from(output);
}
