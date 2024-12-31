import { useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect } from 'react';
import { Button } from '@noita-explorer/noita-component-library';

interface Button {
  element: React.ReactElement;
}

export const useTemplatePageLogic = () => {
  const navigate = useNavigate();

  const goBackOrHome = useCallback(() => {
    if (
      document.referrer &&
      new URL(document.referrer).origin === window.location.origin
    ) {
      navigate(-1); // Go back to the previous page if it belongs to the same site
    } else {
      navigate('/'); // Navigate to home if the previous page is not from the current site
    }
  }, [navigate]);

  const buttons: Button[] = [
    {
      element: <Button onClick={() => goBackOrHome()}>Return</Button>,
    },
  ];

  useEffect(() => {
    const listener: (e: KeyboardEvent) => void = (ev) => {
      if (ev.key === 'Escape') {
        goBackOrHome();
      }
    };

    document.body.addEventListener('keydown', listener);
    return () => document.body.removeEventListener('keydown', listener);
  }, [goBackOrHome]);

  return {
    buttons: buttons,
  };
};
