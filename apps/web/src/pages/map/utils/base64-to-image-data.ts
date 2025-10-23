/**
 * Converts a Base64 string to an ImageData object.
 *
 * @param {string} base64String The Base64 string of the image.
 * @returns {Promise<ImageData>} A promise that resolves with the ImageData object.
 */
export async function base64ToImageData(
  base64String: string,
): Promise<ImageData> {
  const dataUrl = base64String.startsWith('data:image')
    ? base64String
    : `data:image/png;base64,${base64String}`;

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context.'));
      }

      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };

    image.onerror = () => {
      reject(new Error('Failed to load the image from Base64 string.'));
    };

    image.src = dataUrl;
  });
}
