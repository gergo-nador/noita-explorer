import { PixelatedImage } from '@noita-explorer/noita-component-library';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { pages } from '../routes/pages.ts';
import { ifStatement } from '@noita-explorer/tools';
import { zIndexManager } from '../utils/zIndexManager.ts';

const bgBasePath = '/images/backgrounds/';
const bgImages = {
  wideScreenBg: bgBasePath + 'wide_screen_bg.jpg',
  // one of the perfect background
  altarNightBg: bgBasePath + 'altar_night.jpg',
  // not that great with the large red circle in the middle
  theWork: bgBasePath + 'the_work.webp',
  // pretty great bg
  theWorkRegular: bgBasePath + 'the_work_regular.webp',
};

const random = Math.random();
const regularBgImage = ifStatement(random < 0.99, bgImages.altarNightBg)
  .elseIf(random < 0.999, bgImages.theWorkRegular)
  .else(bgImages.theWork);

const decideWhichBg = () => {
  const windowRatio = window.innerWidth / window.innerHeight;
  const normalBrickWindowRation = 1920 / 1080;

  const isWideScreen = windowRatio > normalBrickWindowRation * 1.3;
  if (isWideScreen) {
    return bgImages.wideScreenBg;
  }

  return regularBgImage;
};

// This background component uses functions that are not pure, and it might not look clean.
// The reason behind it, is there should be a single regular background image
// chosen for every session, and the page should stick to that. That's why
// the regularBgImage is defined outside the component
export const PageBackground = () => {
  const [backgroundPath, setBackgroundPath] = useState<string>(decideWhichBg());
  const location = useLocation();

  useEffect(() => {
    const decideWhichBgState = () => {
      const bg = decideWhichBg();
      setBackgroundPath(bg);
    };

    window.addEventListener('resize', decideWhichBgState);
    return () => window.removeEventListener('resize', decideWhichBgState);
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
        zIndex: zIndexManager.pageBackground,
        filter: backgroundFilter,
        transition: 'filter 200ms',
        overflow: 'hidden',
      }}
    >
      <PixelatedImage
        style={{ width: '100%', height: '100%' }}
        src={backgroundPath}
      />
    </div>
  );
};
