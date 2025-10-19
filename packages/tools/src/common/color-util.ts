import color from 'color';

/*
 * Conversions
 */
function internalColor(colorRgba: number) {
  return {
    toRgbaObj: () => toRgbaObj(colorRgba),
    toRgbaHexString: () => toRgbaHexString(colorRgba),
    toRgbaHexHtml: () => toRgbaHexHtml(colorRgba),
    toRgbaNum: () => toRgbaNum(colorRgba),
  };
}

/*
 * Conversions from
 */
function fromArgbString(color: string) {
  const argbRegex = /^[A-Fa-f0-9]{8}$/;

  if (color.startsWith('#')) {
    color = color.substring(1);
  }

  if (!argbRegex.test(color)) {
    throw new Error(
      "Invalid ARGB format. Expected 8 hexadecimal characters (e.g., 'AARRGGBB').",
    );
  }

  // Extract the alpha, red, green, and blue components
  const alpha = parseInt(color.slice(0, 2));
  const red = parseInt(color.slice(2, 4));
  const green = parseInt(color.slice(4, 6));
  const blue = parseInt(color.slice(6, 8));

  const colorRgba = (red << 24) | (blue << 16) | (green << 8) | alpha;
  return internalColor(colorRgba);
}

function fromRgbaString(color: string) {
  const rgbaRegex = /^[A-Fa-f0-9]{8}$/;

  if (color.startsWith('#')) {
    color = color.substring(1);
  }

  if (!rgbaRegex.test(color)) {
    throw new Error(
      "Invalid RGBA format. Expected 8 hexadecimal characters (e.g., 'RRGGBBAA').",
    );
  }

  // Extract the alpha, red, green, and blue components
  const red = parseInt(color.slice(0, 2));
  const green = parseInt(color.slice(2, 4));
  const blue = parseInt(color.slice(4, 6));
  const alpha = parseInt(color.slice(6, 8));

  const colorRgba = (red << 24) | (blue << 16) | (green << 8) | alpha;
  return internalColor(colorRgba);
}

function fromRgbaNumber(rgba: number) {
  return internalColor(rgba);
}

function fromArgbNumber(argb: number) {
  const alpha = (argb & 0xff000000) >>> 24;
  const rgb = argb & 0xffffff;
  const rgba = (alpha << 24) | rgb;

  return internalColor(rgba);
}

/*
 * Conversions to
 */

function toRgbaNum(colorRgba: number) {
  return colorRgba;
}

function toRgbaObj(colorRgba: number) {
  const r = (colorRgba & 0xff000000) >>> 24;
  const g = (colorRgba & 0x00ff0000) >>> 16;
  const b = (colorRgba & 0x0000ff00) >>> 8;
  const a = (colorRgba & 0x000000ff) >>> 0;

  return { r, g, b, a };
}

function toRgbaHexString(colorRgba: number) {
  const { r, g, b, a } = toRgbaObj(colorRgba);

  return `${r.toString(16)}${g.toString(16)}${b.toString(16)}${a.toString(16)}`;
}

function toRgbaHexHtml(colorRgba: number) {
  const { r, g, b, a } = toRgbaObj(colorRgba);

  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}${a.toString(16)}`;
}

/**
 * Converts a color from ARGB format to RGBA format.
 * @param argb - The input color in ARGB format (e.g., "AARRGGBB").
 * @returns The color in RGBA format (e.g., "RRGGBBAA") or `null` if input is invalid.
 */
function convertARGBToRGBA(argb: string): string | null {
  // Ensure the input is in the expected ARGB format (8 characters, hex values)
  const argbRegex = /^[A-Fa-f0-9]{8}$/;

  if (!argbRegex.test(argb)) {
    console.error(
      "Invalid ARGB format. Expected 8 hexadecimal characters (e.g., 'AARRGGBB').",
    );
    return null;
  }

  // Extract the alpha, red, green, and blue components
  const alpha = argb.slice(0, 2);
  const red = argb.slice(2, 4);
  const green = argb.slice(4, 6);
  const blue = argb.slice(6, 8);

  // Construct the #RGBA format
  const rgba = `${red}${green}${blue}${alpha}`;
  return rgba;
}

function getContrastColor(baseColor: string): 'white' | 'black' {
  const [r, g, b] = color(baseColor).rgb().array();

  // https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? 'black' : 'white';
}

function lightenColor(baseColor: string, ratio: number): string {
  const c = color(baseColor);
  return c.lighten(ratio).hex().toString();
}

function convertTextRgbaColorToNumber(rgba: string): number {
  const c = color(rgba);
  const a = Math.floor(c.alpha() * 255);

  const number = (c.red() << 24) | (c.green() << 16) | (c.blue() << 8) | a;
  // back to unsigned
  return number >>> 0;
}

function convertTextRgbColorToNumber(rgb: string): number {
  const c = color(rgb);
  return (c.red() << 16) | (c.green() << 8) | c.blue();
}

export const colorHelpers = {
  conversion: {
    fromArgbString,
    fromRgbaNumber,
    fromArgbNumber,
    fromRgbaString,

    argbToRgba: convertARGBToRGBA,
    rgbaToNumber: convertTextRgbaColorToNumber,
    rgbToNumber: convertTextRgbColorToNumber,
  },
  getRgbaContractsColor: getContrastColor,
  manipulation: {
    lighten: lightenColor,
  },
};
