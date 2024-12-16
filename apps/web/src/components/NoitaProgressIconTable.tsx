import React from 'react';
import { round } from '../utils/utils.ts';

interface NoitaProgressIconTableProps {
  count: number;
  unlocked?: number;
  name: string;
  columnCount: number;
  children: React.ReactNode | React.ReactNode[];
}

export function NoitaProgressIconTable({
  count,
  unlocked,
  name,
  columnCount,
  children,
}: NoitaProgressIconTableProps) {
  return (
    <div style={{ width: '100%' }}>
      {unlocked !== undefined && (
        <div style={{ marginBottom: 5 }}>
          <span style={{ fontSize: 20 }}>
            <span style={{ color: '#FFFFFFCC' }}>
              {name} - {round((100 * unlocked) / count, 1)}%
            </span>{' '}
            <span style={{ color: '#FFFFFF77' }}>
              {unlocked}/{count}
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
