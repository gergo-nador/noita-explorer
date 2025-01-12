import { useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect } from 'react';
import { Button } from '@noita-explorer/noita-component-library';

interface Button {
  element: React.ReactElement;
}

export const useTemplatePageLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBackOrHome = useCallback(
    (forceGoBackToRoot: boolean) => {
      if (location.key && !forceGoBackToRoot) {
        navigate(-1);
      } else {
        navigate('/');
      }
    },
    [navigate, location],
  );

  const buttons: Button[] = [
    {
      element: (
        <Button
          onClick={(e) => {
            const forceGoToRoot = e.detail >= 2;
            goBackOrHome(forceGoToRoot);
          }}
        >
          Return
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const listener: (e: KeyboardEvent) => void = (ev) => {
      if (ev.key === 'Escape') {
        const forceGoToRoot = ev.detail >= 2;
        goBackOrHome(forceGoToRoot);
      }
    };

    document.body.addEventListener('keydown', listener);
    return () => document.body.removeEventListener('keydown', listener);
  }, [goBackOrHome]);

  return {
    buttons: buttons,
  };
};
