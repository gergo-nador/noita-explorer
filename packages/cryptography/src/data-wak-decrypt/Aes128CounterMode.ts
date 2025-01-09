import { createCipheriv } from 'crypto';

/**
 * Implements the manual CTR transform on top of AES-ECB.
 *
 * The original code uses:
 *   _counterEncryptor = symmetricAlgorithm.CreateEncryptor(key, zeroIv);
 *   ...then TransformBlock( counter ) each time we need a new XOR mask.
 */
export class CounterModeCryptoTransform {
  private _counter: Uint8Array;
  private _blockSizeBytes = 16; // AES block size
  private _counterEncryptor; // The AES-ECB encryptor
  private _xorMaskQueue: number[] = [];

  constructor(key: Uint8Array, counter: Uint8Array) {
    if (!key) throw new Error('key cannot be null');
    if (!counter) throw new Error('counter cannot be null');
    if (counter.length !== this._blockSizeBytes) {
      throw new Error(
        `Counter size must match block size = ${this._blockSizeBytes}`,
      );
    }
    // Copy the counter so we don't mutate the passed array externally
    this._counter = new Uint8Array(counter);

    // In .NET: we do AES-ECB with a zero IV, no padding
    const zeroIv = Buffer.alloc(this._blockSizeBytes, 0);
    this._counterEncryptor = createCipheriv('aes-128-ecb', key, zeroIv);
    // For Node >= 10, disable auto-padding to match "PaddingMode.None"
    this._counterEncryptor.setAutoPadding(false);
  }

  /**
   * In .NET, TransformBlock returns the number of bytes written.
   * We'll do the same, but we also produce the output in `outputBuffer`.
   */
  public transformBlock(
    inputBuffer: Uint8Array,
    inputOffset: number,
    inputCount: number,
    outputBuffer: Uint8Array,
    outputOffset: number,
  ): number {
    for (let i = 0; i < inputCount; i++) {
      if (this.needMoreXorMaskBytes()) {
        this.encryptCounterThenIncrement();
      }
      // Dequeue one byte of mask
      const maskByte = this._xorMaskQueue.shift()!;
      // XOR with input
      outputBuffer[outputOffset + i] = inputBuffer[inputOffset + i] ^ maskByte;
    }

    // In the C# code, we see: _xorMask.Clear()
    //   "with every IV change the remaining bytes are discarded,
    //    and as we do exactly 1 transform per IV..."
    // If you truly only call transformBlock() once per new IV,
    // clearing leftover makes sense:
    this._xorMaskQueue = [];

    return inputCount;
  }

  /**
   * TransformFinalBlock is typically for the final chunk.
   * We can call transformBlock internally.
   */
  public transformFinalBlock(
    inputBuffer: Uint8Array,
    inputOffset: number,
    inputCount: number,
  ): Uint8Array {
    const output = new Uint8Array(inputCount);
    this.transformBlock(inputBuffer, inputOffset, inputCount, output, 0);
    return output;
  }

  private needMoreXorMaskBytes(): boolean {
    return this._xorMaskQueue.length === 0;
  }

  private encryptCounterThenIncrement(): void {
    // We encrypt the 16-byte counter with AES-ECB, producing 16 bytes of keystream
    const ecbBlock = this._counterEncryptor.update(this._counter);

    // Then increment the counter
    this.incrementCounter();

    // Queue up the bytes
    for (const b of ecbBlock) {
      this._xorMaskQueue.push(b);
    }
  }

  /**
   * Increments the counter in little-endian style (like the C# code).
   * (Or big-endian, depending on how you interpret the original code.
   *  The .NET code just increments from right to left.)
   */
  private incrementCounter(): void {
    for (let i = this._counter.length - 1; i >= 0; i--) {
      this._counter[i]++;
      if (this._counter[i] !== 0) {
        break;
      }
    }
  }

  // The following properties exist for the .NET ICryptoTransform interface
  public get inputBlockSize(): number {
    return this._blockSizeBytes;
  }

  public get outputBlockSize(): number {
    return this._blockSizeBytes;
  }

  public get canTransformMultipleBlocks(): boolean {
    return true;
  }

  public get canReuseTransform(): boolean {
    return false;
  }

  public dispose(): void {
    // no-op
  }
}

/**
 * TypeScript version of the C# Aes128CounterMode class.
 *
 * In the .NET version:
 *    Mode = CipherMode.ECB
 *    Padding = PaddingMode.None
 * This class basically "wraps" AES-ECB to do a manual CTR transform.
 */
export class Aes128CounterMode {
  private _counter: Uint8Array;

  // Because the original code uses "AesManaged" internally,
  // but sets Mode=ECB, Padding=None,
  // we only need blockSize=16, no external IV for AES-ECB.

  constructor(counter: Uint8Array) {
    if (!counter) {
      throw new Error('Counter cannot be null');
    }
    if (counter.length !== 16) {
      throw new Error(
        `Counter size must be 16 (AES block size). Actual: ${counter.length}`,
      );
    }
    this._counter = new Uint8Array(counter); // store a copy
  }

  /**
   * Equivalent to C# CreateEncryptor(key, ignoredParameter).
   * We return a new CounterModeCryptoTransform in "encrypt" mode,
   * but for CTR it doesn't matter since encryption/decryption are identical.
   */
  public createEncryptor(
    key: Uint8Array,
    // ignored: Uint8Array | null,
  ): CounterModeCryptoTransform {
    return new CounterModeCryptoTransform(key, this._counter);
  }

  /**
   * Equivalent to C# CreateDecryptor(key, ignoredParameter).
   * In CTR mode, encryption == decryption, so we can return the same object.
   */
  public createDecryptor(
    key: Uint8Array,
    // ignored: Uint8Array | null,
  ): CounterModeCryptoTransform {
    return new CounterModeCryptoTransform(key, this._counter);
  }

  /**
   * Not used in your code — placeholders for the SymmetricAlgorithm interface.
   */
  public generateKey(): void {
    // No-op
  }

  public generateIV(): void {
    // IV not needed in manual Counter Mode
  }
}
