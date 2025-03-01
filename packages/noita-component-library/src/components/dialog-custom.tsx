import { ShowCustomDialogProps } from '../ui-models/show-dialog-custom-props.ts';
import React, { useRef } from 'react';
import css from './dialog.module.css';
import { Card } from './card/card';

interface DialogCustomProps {
  isOpen: boolean;
  onCloseRequest?: () => void;
  props: ShowCustomDialogProps;
}

export const DialogCustom = ({
  isOpen,
  onCloseRequest,
  props,
}: DialogCustomProps) => {
  const ref = useRef<HTMLDivElement>(null);

  if (!isOpen) return <span className={'dialog-empty'}></span>;

  const onClickContainer = (e: React.MouseEvent) => {
    const isBackgroundClick = e.target === ref.current;
    if (!isBackgroundClick) return;
    if (typeof onCloseRequest !== 'function') return;

    onCloseRequest();
  };

  return (
    <div className={css['container']} onClick={onClickContainer} ref={ref}>
      <div className={css['dialog']}>
        <Card
          style={{
            maxHeight: '90vh',
          }}
        >
          {props.children}
        </Card>
      </div>
    </div>
  );
};
