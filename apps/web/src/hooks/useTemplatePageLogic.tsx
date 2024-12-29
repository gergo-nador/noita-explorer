import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Button } from '@noita-explorer/noita-component-library';

interface Button {
  element: React.ReactElement;
}

export const useTemplatePageLogic = () => {
  const navigate = useNavigate();

  const buttons: Button[] = [
    {
      element: <Button onClick={() => navigate('/')}>Return</Button>,
    },
  ];

  useEffect(() => {
    const listener: (e: KeyboardEvent) => void = (ev) => {
      if (ev.key === 'Escape') {
        navigate('/');
      }
    };

    document.body.addEventListener('keydown', listener);
    return () => document.body.removeEventListener('keydown', listener);
  }, [navigate]);

  return {
    buttons: buttons,
  };
};
