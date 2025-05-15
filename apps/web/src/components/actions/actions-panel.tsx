import { Button, Card, Icon } from '@noita-explorer/noita-component-library';
import { useState } from 'react';
import { useNoitaActionsStore } from '../../stores/actions.ts';

export const ActionsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { actions } = useNoitaActionsStore();

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          paddingTop: 10,
          paddingRight: 10,
        }}
        onClick={() => setIsOpen(true)}
      >
        <Icon type={'info'} size={20} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          backdropFilter: 'blur(7px)',
          backgroundColor: '#00000066',
          opacity: isOpen ? '1' : '0',
          pointerEvents: isOpen ? 'initial' : 'none',
          transition: 'opacity 200ms',
          zIndex: 10,
        }}
        onClick={() => setIsOpen(false)}
      />
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          transform: isOpen ? 'translate(-20px)' : 'translate(100%)',
          transition: 'transform 200ms',
          zIndex: 10,
        }}
      >
        <Card
          style={{
            minHeight: '40vh',
            maxHeight: '90vh',
            maxWidth: '60vw',
            minWidth: '40vw',
            marginTop: '5vh',
          }}
          styleContent={{
            maxHeight: '100%',
            overflowY: 'auto',
            paddingTop: '0',
            paddingBottom: '0',
          }}
        >
          <div
            style={{
              position: 'sticky',
              top: 0,
              display: 'flex',
              justifyContent: 'center',
              background: 'inherit',
            }}
          >
            <span
              style={{
                fontSize: 23,
                marginTop: 20,
                marginBottom: 10,
                width: '100%',
                background: 'inherit',
              }}
            >
              Actions
            </span>
          </div>
          <div style={{ minHeight: 'calc(100% - 100px)' }}>
            {Object.values(actions).map((action) => (
              <div>{action.name}</div>
            ))}
          </div>
          <div
            style={{
              position: 'sticky',
              bottom: 0,
              paddingTop: 10,
              paddingBottom: 20,
              background: 'inherit',
              display: 'flex',
              justifyContent: 'right',
            }}
          >
            <Button decoration={'both'}>Run Actions</Button>
          </div>
        </Card>
      </div>
    </>
  );
};
