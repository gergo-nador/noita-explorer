# FastLZ

This package compiles the [FastLZ](https://github.com/ariya/FastLZ) to web-assembly, which can be used in the browser environment.

## Usage

```typescript
import { createFastLzCompressor } from '@noita-explorer/fastlz';

const fastLzCompressor = await createFastLzCompressor();

const inputData = new Uint8Array([0, 1, 2]);
const outputData = fastLzCompressor.decompress(inputData);

console.log(outputData)
```

## Compile

### Windows

Run the following command in the root of the `fastlz` package:
```
# to comply the wasm file separately
docker run --rm -v %cd%\src:/src emscripten/emsdk emcc fastlz/fastlz.c -o wrapper/fastlz.js -s EXPORT_ES6=1 -s EXPORT_NAME="createModule" -s EXPORTED_FUNCTIONS="[\"_fastlz_decompress\",\"_malloc\",\"_free\"]" -s EXPORTED_RUNTIME_METHODS="[\"HEAPU8\",\"cwrap\"]" -s ALLOW_MEMORY_GROWTH
```

```
# to bundle the wasm file into javascript
docker run --rm -v %cd%\src:/src emscripten/emsdk emcc fastlz/fastlz.c -o wrapper/fastlz-single.js -s EXPORT_ES6=1 -s EXPORT_NAME="createModule" -s EXPORTED_FUNCTIONS="[\"_fastlz_decompress\",\"_malloc\",\"_free\"]" -s EXPORTED_RUNTIME_METHODS="[\"HEAPU8\",\"cwrap\"]" -s ALLOW_MEMORY_GROWTH -s SINGLE_FILE=1
```

Read more about EMScripten here: https://emscripten.org/docs/getting_started/index.html

Explanation:
```shell
docker run \
       --rm # remove the container after execution
       -v %cd%\src:/src # append src directory as a volumn
       emscripten/emsdk # the container image
       emcc fastlz/fastlz.c -o wrapper/fastlz.js # EMScripten convert the C source file to fastlz.js
        -s EXPORT_ES6=1 # as ES6 module 
        -s EXPORT_NAME="createModule" # exported name
        -s EXPORTED_FUNCTIONS="[\"_fastlz_decompress\",\"_malloc\",\"_free\"]" # only fastlz_decompress is needed right now, malloc and free methods are needed for allocating space for the char pointer
        -s EXPORTED_RUNTIME_METHODS="[\"HEAPU8\",\"cwrap\"]" # char array allocated on the heap, cwrap is a utility function to call C functions in javascript
        -s ALLOW_MEMORY_GROWTH # allow dynamic memory
        -s SINGLE_FILE=1 # bundle wasm into javascript
```