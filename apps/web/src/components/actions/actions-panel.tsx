import { Button, Card, Icon } from '@noita-explorer/noita-component-library';
import { useState } from 'react';
import { useNoitaActionsStore } from '../../stores/actions.ts';
import { useRunActions } from '../../hooks/use-run-actions.ts';
import { Flex } from '@noita-explorer/react-utils';
import { NoitaActionResult } from '@noita-explorer/model-noita';
import { SpaceCharacter } from '../space-character.tsx';
import { ZIndexManager } from '../../utils/z-index-manager.ts';

export const ActionsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { actions, actionUtils } = useNoitaActionsStore();
  const numberOfActions = Object.keys(actions).length;
  const {
    isRunning,
    progress,
    runActions,
    runActionWarning,
    lastRunFailedActions,
    acceptWarning,
  } = useRunActions({
    successCallback: () => setIsOpen(false),
  });

  const progressNumber = (progress?.success ?? 0) + (progress?.failed ?? 0);

  const removeAllActions = () => {
    Object.values(actions).map((action) => actionUtils.removeAction(action));
    setIsOpen(false);
  };

  return (
    <>
      {numberOfActions > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            paddingTop: 10,
            paddingRight: 10,
            cursor: 'pointer',
          }}
          onClick={() => setIsOpen(true)}
        >
          <Card styleContent={{ padding: 5 }}>
            {isRunning && (
              <span>
                {progressNumber} / {Object.keys(actions).length}
              </span>
            )}
            {!isRunning && <span>{numberOfActions}</span>}
          </Card>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          backdropFilter: 'blur(10px)',
          backgroundColor: '#00000066',
          opacity: isOpen ? '1' : '0',
          pointerEvents: isOpen ? 'initial' : 'none',
          transition: 'opacity 200ms',
          zIndex: ZIndexManager.actionPanel,
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
          zIndex: ZIndexManager.actionPanel,
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
          {runActionWarning.display && (
            <RunActionsWarning acceptWarning={acceptWarning} />
          )}
          {!runActionWarning.display && (
            <>
              <Flex
                justify={'center'}
                style={{
                  position: 'sticky',
                  top: 0,
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
                  {numberOfActions > 0 && <span> ({numberOfActions})</span>}
                </span>
              </Flex>
              <div style={{ minHeight: 'calc(100% - 100px)' }}>
                {Object.values(actions).map((action) => {
                  const failedData: NoitaActionResult | undefined =
                    lastRunFailedActions[action.id];

                  return (
                    <div key={action.id}>
                      <Flex gap={10} align='center' className='hover-container'>
                        {action.name}
                        <span
                          className='hover-display'
                          onClick={() => actionUtils.removeAction(action)}
                          style={{ cursor: 'pointer', marginLeft: 10 }}
                        >
                          <Icon size={15} type='cross' />
                        </span>
                      </Flex>
                      {failedData && (
                        <div
                          style={{ paddingLeft: 20 }}
                          className='text-danger'
                        >
                          {('error' in failedData &&
                            failedData.error?.message) ||
                            'Unknown error :C'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <Flex
                justify='space-between'
                style={{
                  position: 'sticky',
                  bottom: 0,
                  paddingTop: 10,
                  paddingBottom: 20,
                  background: 'inherit',
                }}
              >
                <Button
                  onClick={removeAllActions}
                  textStyle={{ color: '#d55456' }}
                >
                  Remove all
                </Button>
                <Button disabled={isRunning} onClick={runActions}>
                  {isRunning && (
                    <span>
                      Running... ({progressNumber}
                      <SpaceCharacter />
                      /
                      <SpaceCharacter />
                      {Object.keys(actions).length})
                    </span>
                  )}
                  {!isRunning && <span>Run Actions</span>}
                </Button>
              </Flex>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

const RunActionsWarning = ({
  acceptWarning,
}: {
  acceptWarning: () => void;
}) => {
  return (
    <div style={{ padding: 10, paddingTop: 20, maxWidth: '40vw' }}>
      <Flex justify='center' gap={10}>
        <Icon type={'warning'} size={20} />
        <span style={{ fontSize: 20 }}>Warning</span>
        <Icon type={'warning'} size={20} />
      </Flex>
      <br />
      <div>
        Actions modify your save files. In some cases it can corrupt your save
        files, and there is no way to restore them without a backup.
      </div>
      <br />
      <div>
        Before running your first action, please make a backup of your save00
        folder.
      </div>
      <br />
      <div>
        Noita Explorer and its developers are not responsible in any way for
        your save files.
      </div>
      <br />
      <div>So please make a backup of your save files!</div>
      <br />
      <br />
      <Button onClick={() => acceptWarning()}>
        Click here to accept the risk of running actions, and that you confirm
        you have made a backup of your save files.
      </Button>
    </div>
  );
};
