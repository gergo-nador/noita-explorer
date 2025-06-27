import wideScreenBg from '../assets/backgrounds/wide_screen_bg.jpg';
import altarNightBg from '../assets/backgrounds/altar_night.jpg';

import { PixelatedImage } from '@noita-explorer/noita-component-library';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { pages } from '../routes/pages.ts';

export const Background = () => {
  const [background, setBackground] = useState<string>();
  const location = useLocation();

  useEffect(() => {
    const decideWhichBg = () => {
      const windowRatio = window.innerWidth / window.innerHeight;
      const normalBrickWindowRation = 1920 / 1080;

      const isWideScreen = windowRatio > normalBrickWindowRation * 1.3;
      if (isWideScreen) {
        setBackground(wideScreenBg);
        return;
      }

      setBackground(altarNightBg);
    };

    decideWhichBg();

    window.addEventListener('resize', decideWhichBg);
    return () => window.removeEventListener('resize', decideWhichBg);
  }, []);

  let backgroundFilter = 'brightness(0.7)';
  if (location.pathname !== pages.main) {
    backgroundFilter = 'brightness(0.5) blur(4px)';
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        filter: backgroundFilter,
        transition: 'filter 200ms',
        overflow: 'hidden',
      }}
    >
      <PixelatedImage
        style={{ width: '100%', height: '100%' }}
        src={background}
      />
    </div>
  );
};
