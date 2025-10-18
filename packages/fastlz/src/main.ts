import createModule, { ImportModule } from './wrapper/fastlz';

export async function createFastLzCompressor() {
  const module = await createModule();

  return {
    decompress: (input: Uint8Array, maxOutputSize?: number) =>
      decompress({ module, input, maxOutputSize }),
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
  const fastlzDecompress = module.cwrap('_fastlz_decompress', 'number', [
    'number',
    'number',
    'number',
    'number',
  ]);

  if (maxOutputSize === undefined) {
    // this should be enough for fastlz
    maxOutputSize = input.length * 10;
  }

  // allocate memory
  const inputPtr = module._malloc(input.length);
  const outputPtr = module._malloc(maxOutputSize);

  try {
    // copy input data to WASM memory
    module.HEAPU8.set(input, inputPtr);

    // Call decompression function
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

createFastLzCompressor().then((fastLzCompressor) => {
  const inputData = new Uint8Array([0, 1, 2]);
  const outputData = fastLzCompressor.decompress(inputData);
  console.log(outputData);
});
