export class WakRng {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
    if (this.state >= 2147483647.0) {
      this.state *= 0.5;
    }
    this.next();
  }

  public set Seed(value: number) {
    this.state = value;
  }

  public next(): number {
    // Cast our internal state to int (32-bit).
    let value = this.state | 0;

    // -- 1) long val0 = -2092037281L * value;
    //        => use BigInt for 64-bit multiplication
    const val0 = BigInt(-2092037281) * BigInt(value);

    // -- 2) ulong val1 = (ulong)val0 >> 32;
    //        => shift right by 32 bits (as unsigned).
    //           Then cast down to a 32-bit number for usage.
    //           We mask with 0xFFFFFFFFn so we only take the low 32 bits
    //           (which replicates (ulong) cast in C#).
    const val1 = val0 >> BigInt(32);
    const val1Number = Number(val1 & BigInt(0xffffffff));

    // -- 3) int val2 = (int)(value + (uint)val1);
    const val2 = (value + val1Number) | 0; // cast back to 32-bit int

    // -- 4) uint temp = (uint)(val2 >> 16);
    //       In C#, shifting a negative int extends the sign bit,
    //       then casting to uint reinterprets it as a 32-bit unsigned.
    //       In JS/TS, we can do `>>> 0` to force unsigned.
    const temp = (val2 >> 16) >>> 0;

    // -- 6) value = (int)(16807 * value - 0x7FFFFFFF * (temp + (temp >> 31)));
    //        In TypeScript, we keep it as 32-bit integer arithmetic.
    //        Notice (temp >> 31) is either 0 or 1, since temp is a 32-bit unsigned.
    value = (16807 * value - 0x7fffffff * (temp + (temp >> 31))) | 0;

    // -- 7) if (value <= 0) value += 0x7FFFFFFF;
    if (value <= 0) {
      value += 0x7fffffff;
    }

    // -- 8) state = value; return state * 4.656612875e-10;
    this.state = value;
    return this.state * 4.656612875e-10;
  }
}
