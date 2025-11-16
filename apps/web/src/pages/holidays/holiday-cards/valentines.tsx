import { Card, Icon } from '@noita-explorer/noita-component-library';
import Particles from '@tsparticles/react';
import { ISourceOptions } from '@tsparticles/engine';
import { NoitaMaterialLink } from '../../../components/noita-material-link.tsx';
import { publicPaths } from '../../../utils/public-paths.ts';

export const Valentines = () => {
  const heartGif = publicPaths.static.holidays('Heart_extrahp_default.gif');
  const heartImage = publicPaths.static.holidays('charm-high-res.png');

  // https://particles.js.org/docs/interfaces/tsParticles_Engine.Options_Interfaces_IOptions.IOptions.html
  const particlesPermanentOptions: ISourceOptions = {
    fpsLimit: 60,
    fullScreen: {
      enable: false,
    },
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
        },
      },
      shape: {
        type: 'image',
        options: {
          image: {
            src: heartImage,
          },
        },
      },
      color: {
        value: ['#D13A64', '#E23F6D'],
      },
      opacity: {
        value: { min: 0.25, max: 0.5 },
      },
      size: {
        value: { min: 10, max: 20 },
      },
      move: {
        enable: true,
        speed: 2,
        random: false,
        direction: 'top',
      },
    },
  };
  // https://particles.js.org/docs/interfaces/tsParticles_Engine.Options_Interfaces_IOptions.IOptions.html
  const particlesClickableOptions: ISourceOptions = {
    fpsLimit: 60,
    fullScreen: {
      enable: false,
    },
    particles: {
      number: {
        value: 20,
        density: {
          enable: true,
        },
      },
      shape: {
        type: 'image',
        options: {
          image: {
            src: heartImage,
          },
        },
      },
      color: {
        value: ['#D13A64', '#E23F6D'],
      },
      opacity: {
        value: { min: 0.25, max: 0.5 },
      },
      size: {
        value: { min: 10, max: 20 },
      },
      move: {
        enable: true,
        speed: 2,
        random: false,
        direction: 'top',
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
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translateY(-50%) translateX(-50%) rotateZ(-15deg)',
          }}
        >
          <Icon src={heartGif} />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            transform: 'translateY(-50%) translateX(50%) rotateZ(15deg)',
          }}
        >
          <Icon src={heartGif} />
        </div>
      </div>

      <Card
        styling={{
          borderDark: '#E23F6D',
          borderBright: '#D13A64',
          background: 'linear-gradient(to top, #330E19, #16060B)',
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
            id='tsparticles-valentines-permanent'
            options={particlesPermanentOptions}
            className='ts-particles-wrapper'
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
            id='tsparticles-valentines-click'
            options={particlesClickableOptions}
            className='ts-particles-wrapper'
          />
        </div>
        <div>
          <div style={{ marginBottom: 15 }}>
            <span className='text-xl'>Valentine's Day</span>
            <span className='text-secondary text-xl'> - 14 February</span>
          </div>
          <div>
            <span>Extra Max Health and </span>
            <NoitaMaterialLink
              materialId='magic_liquid_charm'
              name='Pheromone'
              isInline
            />
            <span> will spawn more often.</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
