import { Flex } from '@noita-explorer/react-utils';
import { useRouteError } from 'react-router-dom';
import { Card } from '@noita-explorer/noita-component-library';
import { Error404 } from './404.tsx';
import { environment } from '../../environment.ts';
import { UnknownError } from './unknown-error.tsx';
import React from 'react';

export const ErrorPage = () => {
  const error = useRouteError();

  const status =
    error && typeof error === 'object' && 'status' in error && error.status;

  const errors: [boolean, () => React.ReactNode][] = [
    [status === 404, Error404],
  ];

  const ErrorComponent = errors.find((e) => e[0])?.[1] ?? UnknownError;

  return (
    <Flex column center style={{ padding: 10 }}>
      <Card>
        <ErrorComponent />

        {environment !== 'production' && (
          <div style={{ paddingTop: 50, whiteSpace: 'pre' }}>
            Error object (only visible in preview and development):
            <div>{JSON.stringify(error, undefined, 2)}</div>
          </div>
        )}
      </Card>
    </Flex>
  );
};
