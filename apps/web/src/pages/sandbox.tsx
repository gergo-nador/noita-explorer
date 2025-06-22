import Particles from '@tsparticles/react';

import {
  DestroyType,
  type IParticlesOptions,
  type IRangeValue,
  type ISourceOptions,
  MoveDirection,
  OutMode,
  type RangeValue,
  type RecursivePartial,
  type Container,
  StartValueType,
  rgbToHsl,
  setRangeValue,
} from '@tsparticles/engine';
import Color from 'color';
import { useCallback, useRef } from 'react';

export const Sandbox = () => {
  const particlesRef = useRef<Container>(undefined);
  const handleFirework = useCallback(() => {
    const container = particlesRef.current;
    if (!container) return;

    // @ts-expect-error addEmitter exists
    container.addEmitter({
      direction: MoveDirection.top,
      life: {
        count: 3,
        duration: 0.1,
        delay: 0.1,
      },
      rate: {
        delay: 0.05,
        quantity: 1,
      },
      size: {
        width: 100,
        height: 0,
      },
      position: {
        y: 100,
        x: 50,
      },
    });
  }, []);

  return (
    <div>
      <button
        onClick={handleFirework}
        style={{ position: 'absolute', zIndex: 2, top: 20, left: 20 }}
      >
        Launch Firework
      </button>
      <div style={{ width: '100%', height: '90vh' }}>
        <Particles
          id='fireworks'
          options={initOptions()}
          particlesLoaded={async (container) => {
            particlesRef.current = container;
          }}
        />
      </div>
    </div>
  );
};

function initOptions(): ISourceOptions {
  const fixRange = (
    value: IRangeValue,
    min: number,
    max: number,
  ): RangeValue => {
    const minValue = 0,
      diffSMax = value.max > max ? value.max - max : minValue;

    let res = setRangeValue(value);

    if (diffSMax) {
      res = setRangeValue(value.min - diffSMax, max);
    }

    const diffSMin = value.min < min ? value.min : minValue;

    if (diffSMin) {
      res = setRangeValue(minValue, value.max + diffSMin);
    }

    return res;
  };
  const fireworksOptions: RecursivePartial<IParticlesOptions>[] = [
    '#ff595e',
    '#ffca3a',
    '#8ac926',
    '#1982c4',
    '#6a4c93',
  ]
    .map((color) => {
      const colorRgb = Color(color).rgb();
      const rgb = {
        r: colorRgb.red(),
        g: colorRgb.green(),
        b: colorRgb.blue(),
      };

      if (!rgb) {
        return undefined;
      }

      const hsl = rgbToHsl(rgb),
        sOffset = 30,
        lOffset = 30,
        sBounds: IRangeValue = {
          min: 0,
          max: 100,
        },
        lBounds: IRangeValue = {
          min: 0,
          max: 100,
        },
        sRange = fixRange(
          { min: hsl.s - sOffset, max: hsl.s + sOffset },
          sBounds.min,
          sBounds.max,
        ),
        lRange = fixRange(
          { min: hsl.l - lOffset, max: hsl.l + lOffset },
          lBounds.min,
          lBounds.max,
        );

      return {
        color: {
          value: {
            h: hsl.h,
            s: sRange,
            l: lRange,
          },
        },
        stroke: {
          width: 0,
        },
        number: {
          value: 0,
        },
        opacity: {
          value: {
            min: 0.1,
            max: 1,
          },
          animation: {
            enable: true,
            speed: 0.7,
            sync: false,
            startValue: StartValueType.max,
            destroy: DestroyType.min,
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 2 },
          animation: {
            enable: true,
            speed: 5,
            count: 1,
            sync: false,
            startValue: StartValueType.min,
            destroy: DestroyType.none,
          },
        },
        life: {
          count: 1,
          duration: {
            value: {
              min: 1,
              max: 2,
            },
          },
        },
        move: {
          decay: { min: 0.075, max: 0.1 },
          enable: true,
          gravity: {
            enable: true,
            inverse: false,
            acceleration: 5,
          },
          speed: { min: 5, max: 15 },
          direction: 'none',
          outModes: OutMode.destroy,
        },
      } as RecursivePartial<IParticlesOptions>;
    })
    .filter((t) => t !== undefined) as RecursivePartial<IParticlesOptions>[];

  return {
    detectRetina: true,
    fpsLimit: 120,
    emitters: {
      autoPlay: false,
      direction: MoveDirection.top,
      life: {
        count: 0,
        duration: 0.1,
        delay: 0.1,
      },
      rate: {
        delay: 0.05,
        quantity: 1,
      },
      size: {
        width: 100,
        height: 0,
      },
      position: {
        y: 100,
        x: 50,
      },
    },
    particles: {
      number: {
        value: 0,
      },
      destroy: {
        mode: 'split',
        bounds: {
          top: { min: 10, max: 30 },
        },
        split: {
          sizeOffset: false,
          count: 1,
          factor: {
            value: 0.333333,
          },
          rate: {
            value: { min: 75, max: 150 },
          },
          particles: fireworksOptions,
        },
      },
      life: {
        count: 1,
      },
      shape: {
        type: 'line',
      },
      size: {
        value: {
          min: 0.1,
          max: 50,
        },
        animation: {
          enable: true,
          sync: true,
          speed: 90,
          startValue: StartValueType.max,
          destroy: DestroyType.min,
        },
      },
      stroke: {
        color: {
          value: '#ffffff',
        },
        width: 1,
      },
      rotate: {
        path: true,
      },
      move: {
        enable: true,
        gravity: {
          acceleration: 15,
          enable: true,
          inverse: true,
          maxSpeed: 100,
        },
        speed: {
          min: 10,
          max: 20,
        },
        outModes: {
          default: OutMode.destroy,
          top: OutMode.none,
        },
        trail: {
          fill: {
            color: '#000',
          },
          enable: true,
          length: 10,
        },
      },
    },
  };
}
