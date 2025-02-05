/**
 * Converts a color from ARGB format to #RGBA format.
 * @param argb - The input color in ARGB format (e.g., "AARRGGBB").
 * @returns The color in #RGBA format (e.g., "#RRGGBBAA") or `null` if input is invalid.
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

function getContrastColor(color: string): 'white' | 'black' {
  let r: number, g: number, b: number;

  // If color is in HEX format, convert it to RGB
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');

    if (hex.length === 3) {
      // Convert shorthand hex (e.g., #FFF) to full hex (e.g., #FFFFFF)
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6 || hex.length === 8) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      throw new Error('Invalid HEX color.');
    }
  }
  // If color is in RGB format
  else if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (!match || match.length < 3) throw new Error('Invalid RGB color.');
    r = parseInt(match[0]);
    g = parseInt(match[1]);
    b = parseInt(match[2]);
  } else {
    throw new Error(
      'Unsupported color format. Use HEX (#RRGGBB) or RGB (rgb(R, G, B)).',
    );
  }

  // Calculate luminance using the standard formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? 'black' : 'white';
}

export const colorHelpers = {
  conversion: {
    argbToRgba: convertARGBToRGBA,
  },
  getRgbaContractsColor: getContrastColor,
};
