import React from 'react';
import { NoitaProgressEntity } from '@noita-explorer/model';

interface NoitaProgressIconTableProps {
  data: NoitaProgressEntity[];
  name: string;
  columnCount: number;
  children: React.ReactNode | React.ReactNode[];
  unlocked?: number;
}

export function NoitaProgressIconTable({
  data,
  name,
  columnCount,
  children,
  unlocked,
}: NoitaProgressIconTableProps) {
  return (
    <div style={{ width: '100%' }}>
      {unlocked !== undefined && (
        <div style={{ marginBottom: 5 }}>
          <span style={{ fontSize: 22 }}>
            <span style={{ color: '#FFFFFFCC' }}>
              {name} - {(unlocked / data.length) * 100}%
            </span>{' '}
            <span style={{ color: '#FFFFFF77' }}>
              {unlocked}/{data.length}
            </span>
          </span>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          width: '100%',
          gap: 3,
        }}
      >
        {children}
      </div>
    </div>
  );
}
