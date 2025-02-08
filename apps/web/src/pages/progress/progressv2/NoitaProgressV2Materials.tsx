import { useNoitaDataWakStore } from '../../../stores/NoitaDataWak.ts';
import { useEffect, useState } from 'react';
import potionPng from '../../../assets/potion.png';

export const NoitaProgressV2Materials = () => {
  const { data } = useNoitaDataWakStore();
  const [img, setImg] = useState<string>();

  useEffect(() => {
    colorNoitaPotion().then(setImg);
  }, []);

  if (!data?.materials) {
    return <div>Noita Data Wak is not loaded.</div>;
  }

  return (
    <div>
      <div>potion:</div>
      <div>
        <img src={potionPng} style={{ zoom: 4, imageRendering: 'pixelated' }} />
        <img src={img} style={{ zoom: 4, imageRendering: 'pixelated' }} />
      </div>
    </div>
  );
};

function colorNoitaPotion() {
  // parameters:
  const wangColor = {
    r: 47 / 255,
    g: 85 / 255,
    b: 76 / 255,
    a: 1,
  };
  const mouthColor = {
    r: 0.85,
    g: 0.85,
    b: 0.85,
    a: 1,
  };

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const tex = new Image();
  tex.src = potionPng; // Replace with actual texture path

  function applyColorFilter(imageData: ImageData, color) {
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const isFirstRow = i / 4 <= canvas.width;
      const rowColor = isFirstRow ? mouthColor : color;

      data[i] *= rowColor.r;
      data[i + 1] *= rowColor.g;
      data[i + 2] *= rowColor.b;
      data[i + 3] *= rowColor.a;
    }
    return imageData;
  }

  function renderPotion(color) {
    ctx.drawImage(tex, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    imageData = applyColorFilter(imageData, color);

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  }

  return new Promise((resolve, reject) => {
    tex.onload = () => {
      canvas.width = tex.width;
      canvas.height = tex.height;
      const base64 = renderPotion(wangColor);
      resolve(base64);
    };
  });
}
