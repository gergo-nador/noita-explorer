import color from 'color';

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

export const colorHelpers = {
  conversion: {
    argbToRgba: convertARGBToRGBA,
  },
  getRgbaContractsColor: getContrastColor,
};
