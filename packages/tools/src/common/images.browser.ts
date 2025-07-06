import color from 'color';
import { ImageHelpersType } from './images.types.ts';

function rotateImageBase64(base64: string, degrees: number): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create an Image element
    const img = new Image();
    img.onload = () => {
      // Create an off-screen canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D context'));
        return;
      }

      // Set the canvas size to fit the rotated image
      const radians = (degrees * Math.PI) / 180;
      const sin = Math.abs(Math.sin(radians));
      const cos = Math.abs(Math.cos(radians));
      const width = img.width;
      const height = img.height;
      canvas.width = Math.ceil(width * cos + height * sin);
      canvas.height = Math.ceil(width * sin + height * cos);

      // Translate and rotate the canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);

      // Draw the image onto the canvas
      ctx.drawImage(img, -width / 2, -height / 2);

      // Get the rotated image as Base64
      resolve(canvas.toDataURL());
    };

    img.onerror = () => {
      reject(new Error('Failed to load the image'));
    };

    // Set the source of the image to the Base64 string
    img.src = base64;
  });
}

function scaleImageBase64(
  base64: string,
  scaleFactor: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create an Image element
    const img = new Image();
    img.onload = () => {
      // Create an off-screen canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D context'));
        return;
      }

      // Set the canvas size to the scaled image size
      const width = img.width * scaleFactor;
      const height = img.height * scaleFactor;
      canvas.width = width;
      canvas.height = height;

      // Set nearest-neighbor scaling
      ctx.imageSmoothingEnabled = false;

      // Draw the scaled image onto the canvas
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);

      // Get the scaled image as Base64
      resolve(canvas.toDataURL());
    };

    img.onerror = () => {
      reject(new Error('Failed to load the image'));
    };

    // Set the source of the image to the Base64 string
    img.src = base64;
  });
}

function trimWhitespaceBase64(base64: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create an Image element
    const img = new Image();
    img.onload = () => {
      // Create an off-screen canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D context'));
        return;
      }

      // Set the canvas size to the image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Get the image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data, width, height } = imageData;

      // Find the bounds of the non-transparent pixels
      let top = height;
      let left = width;
      let right = 0;
      let bottom = 0;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3]; // Alpha channel
          if (alpha > 0) {
            // Non-transparent pixel
            top = Math.min(top, y);
            left = Math.min(left, x);
            right = Math.max(right, x);
            bottom = Math.max(bottom, y);
          }
        }
      }

      // Handle case where the image is fully transparent
      if (right < left || bottom < top) {
        reject(new Error('Image is fully transparent'));
        return;
      }

      // Calculate the dimensions of the trimmed area
      const trimmedWidth = right - left + 1;
      const trimmedHeight = bottom - top + 1;

      // Create a new canvas with the trimmed dimensions
      const trimmedCanvas = document.createElement('canvas');
      const trimmedCtx = trimmedCanvas.getContext('2d');
      if (!trimmedCtx) {
        reject(new Error('Failed to get 2D context for trimmed canvas'));
        return;
      }
      trimmedCanvas.width = trimmedWidth;
      trimmedCanvas.height = trimmedHeight;

      // Draw the trimmed image onto the new canvas
      trimmedCtx.drawImage(
        canvas,
        left,
        top,
        trimmedWidth,
        trimmedHeight,
        0,
        0,
        trimmedWidth,
        trimmedHeight,
      );

      // Get the trimmed image as Base64
      resolve(trimmedCanvas.toDataURL());
    };

    img.onerror = () => {
      reject(new Error('Failed to load the image'));
    };

    // Set the source of the image to the Base64 string
    img.src = base64;
  });
}

function getAverageColorBase64(base64: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // To avoid CORS issues
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject('Canvas rendering context not supported');
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, img.width, img.height).data;
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i]; // Red
        g += imageData[i + 1]; // Green
        b += imageData[i + 2]; // Blue
        a += imageData[i + 3];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      a = Math.floor(a / count);

      const colorObj = color({ r, g, b, alpha: a });
      resolve(colorObj.rgb().toString());
    };

    img.onerror = () => reject('Failed to load image');
  });
}

function getImageSizeBase64(
  base64: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // Create an Image element
    const img = new Image();
    img.onload = () => {
      // Create an off-screen canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D context'));
        return;
      }

      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => reject('Failed to load image');
    img.src = base64;
  });
}

async function cropImageBase64(
  base64: string,
  options: { x: number; y: number; width: number; height: number },
): Promise<string> {
  const { x: cropX, y: cropY, width: cropWidth, height: cropHeight } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Needed if loading from different origin

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Failed to get canvas context');
        return;
      }

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      );
      const croppedDataUrl = canvas.toDataURL('image/png');
      resolve(croppedDataUrl);
    };

    img.onerror = (err) => reject('Image load failed: ' + err);
    img.src = base64;
  });
}

export const imageHelpers: ImageHelpersType = {
  trimWhitespaceBase64,
  scaleImageBase64,
  rotateImageBase64,
  getAverageColorBase64,
  getImageSizeBase64,
  cropImageBase64,
};
