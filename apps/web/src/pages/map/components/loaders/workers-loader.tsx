import { useThreadsPool } from '../../map-renderer-threads/use-threads-pool.ts';

export const WorkersLoader = () => {
  const { status } = useThreadsPool();

  return Object.values(status).map((status) => {
    return (
      <div>
        <span>{status.id}: </span>
        {status.state === 'started' && (
          <span style={{ color: 'grey' }}>{status.state}</span>
        )}
        {status.state === 'initialized' && (
          <span style={{ color: 'yellow' }}>{status.state}</span>
        )}
        {status.state === 'running' && (
          <span style={{ color: 'green' }}>{status.state}</span>
        )}
        {status.state === 'error' && (
          <span style={{ color: 'red' }}>{status.state}</span>
        )}
        {status.state === 'init-error' && (
          <span style={{ color: 'red' }}>{status.state}</span>
        )}
      </div>
    );
  });
};
