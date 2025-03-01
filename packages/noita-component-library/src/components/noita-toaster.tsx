import { useToaster } from 'react-hot-toast/headless';
import { Card } from './card/card';
import React, { LegacyRef } from 'react';

export const NoitaToaster = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;

  const stylings = {
    error: {
      borderBright: '#ed0000',
      borderDark: '#b80000',
    },
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
      }}
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((toast) => {
        const offset = calculateOffset(toast, {
          reverseOrder: false,
        });
        const ref = (el: HTMLElement) => {
          if (el && typeof toast.height !== 'number') {
            const height = el.getBoundingClientRect().height;
            updateHeight(toast.id, height);
          }
        };

        return (
          <div
            key={toast.id}
            ref={ref as LegacyRef<HTMLDivElement>}
            style={{
              position: 'absolute',
              width: 'max-content',
              maxWidth: '350px',
              right: 0,
              bottom: 0,
              transition: 'all 0.5s ease-out',
              opacity: toast.visible ? 1 : 0,
              transform: `translateY(-${offset}px)`,
            }}
          >
            <Card
              styling={toast.type === 'error' ? stylings.error : undefined}
              styleContent={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                wordBreak: 'break-word',
              }}
            >
              {toast.icon}
              {toast.message as React.ReactNode}
            </Card>
          </div>
        );
      })}
    </div>
  );
};
