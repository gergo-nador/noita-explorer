import React from 'react';
import { DataWakServiceContext } from './data-wak-service.context.ts';
import { useNoitaDataWakStore } from '../../stores/noita-data-wak.ts';

interface Props {
  children: React.ReactNode;
}

export const DataWakServiceProvider = ({ children }: Props) => {
  const { data, lookup, loaded } = useNoitaDataWakStore();

  if (!loaded) {
    return <div>Loading data wak...</div>;
  }

  if (!data || !lookup) {
    return <div className='text-danger'>Data wak not found</div>;
  }

  return (
    <DataWakServiceContext value={{ data, lookup }}>
      {children}
    </DataWakServiceContext>
  );
};
