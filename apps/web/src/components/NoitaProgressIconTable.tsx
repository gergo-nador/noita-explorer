import React from 'react';
import { mathHelpers } from '@noita-explorer/tools';

interface NoitaProgressIconTableProps {
  count: number;
  unlocked?: number;
  name: string;
  columnCount: number;
  iconGap?: number;
  children: React.ReactNode | React.ReactNode[];
}

export function NoitaProgressIconTable({
  count,
  unlocked,
  name,
  columnCount,
  iconGap = 3,
  children,
}: NoitaProgressIconTableProps) {
  return (
    <div style={{ width: '100%' }}>
      {unlocked !== undefined && (
        <div style={{ marginBottom: 5 }}>
          <span style={{ fontSize: 20 }}>
            <span style={{ color: '#FFFFFFCC' }}>
              {name} - {mathHelpers.round((100 * unlocked) / count, 1)}%
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
          gap: iconGap,
        }}
      >
        {children}
      </div>
    </div>
  );
}
