import { Card } from '@noita-explorer/noita-component-library';
import { useCallback } from 'react';
import type { Engine, ISourceOptions } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';
import Particles from 'react-particles';

import snow from '../../../assets/holidays/snowrock.png';

export const Winter = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
  }, []);

  // https://particles.js.org/docs/interfaces/tsParticles_Engine.Options_Interfaces_IOptions.IOptions.html
  const particlesOptions: ISourceOptions = {
    fpsLimit: 60,
    fullScreen: {
      enable: false,
    },
    particles: {
      number: {
        value: 500,
        density: {
          enable: true,
        },
      },
      shape: {
        type: 'square',
      },
      color: {
        value: ['#a6c2d8', '#81b0d2'],
      },
      opacity: {
        value: { min: 0.1, max: 0.5 },
      },
      size: {
        value: { min: 1, max: 3 },
      },
      move: {
        enable: true,
        speed: 2,
        random: false,
        direction: 'bottom',
      },
    },
    interactivity: {
      detectsOn: 'parent',
      events: {
        onClick: {
          enable: true,
          mode: 'push',
        },
      },
    },
  };

  return (
    <div style={{ position: 'relative' }}>
      <Card
        styling={{
          borderDark: '#a6c2d8',
          borderBright: '#81b0d2',
          backgroundImage: snow,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
          }}
        >
          <Particles
            id='tsparticles-winter'
            init={particlesInit}
            options={particlesOptions} // prevent some typescript bullshit error
            className={'ts-particles-wrapper'}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ marginBottom: 15 }}>
            <span className={'text-xl'}>Winter</span>
            <span className={'text-secondary text-xl'}>
              {' '}
              - December – February
            </span>
          </div>
          <div>
            Snow and slush weather has a chance to appear in the overworld
            alongside the Freezing biome modifier.
          </div>
        </div>
      </Card>
    </div>
  );
};
