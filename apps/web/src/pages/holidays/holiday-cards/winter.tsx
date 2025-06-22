import { Card } from '@noita-explorer/noita-component-library';
import snow from '../../../assets/holidays/snowrock.png';
import { ISourceOptions } from '@tsparticles/engine';
import Particles from '@tsparticles/react';

export const Winter = () => {
  // https://particles.js.org/docs/interfaces/tsParticles_Engine.Options_Interfaces_IOptions.IOptions.html
  const particlesPermanentOptions: ISourceOptions = {
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
  };

  const particlesClickableOptions: ISourceOptions = {
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
      life: {
        duration: {
          sync: false,
          value: { min: 15, max: 20 },
        },
        count: 1,
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
            id='tsparticles-winter-permanent'
            options={particlesPermanentOptions}
            className={'ts-particles-wrapper'}
          />
        </div>
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
            id='tsparticles-winter-click'
            options={particlesClickableOptions}
            className={'ts-particles-wrapper'}
          />
        </div>
        <div>
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
