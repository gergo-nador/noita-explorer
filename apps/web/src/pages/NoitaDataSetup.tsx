import { Outlet } from 'react-router-dom';
import { PageBaseCard } from '../components/PageBaseCard';

export const NoitaDataSetup = () => {
  return (
    <PageBaseCard>
      <Outlet />
    </PageBaseCard>
  );
};
