import { ImgHTMLAttributes } from 'react';

export const PixelatedImage = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return (
    <img {...props} style={{ ...props.style, imageRendering: 'pixelated' }} />
  );
};
