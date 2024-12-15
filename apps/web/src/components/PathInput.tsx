import {
  Button,
  useToast,
  ContextMenuItem,
  useContextMenuStore,
} from '@noita-explorer/noita-component-library';
import { noitaAPI } from '../ipcHandlers.ts';

interface PathInputProps {
  path: string | undefined;
  displayPath?: string;
  startInIfPathEmpty?: string;
  setPath: (path: string) => void;
  dialogTitle?: string;
  type: 'file' | 'directory';
}

export const PathInput = ({
  path,
  displayPath,
  startInIfPathEmpty,
  setPath,
  dialogTitle,
  type,
}: PathInputProps) => {
  const onPathSelect = () => {
    if (type === 'directory') {
      noitaAPI.dialog
        .openFolderDialog({
          startIn: path ?? startInIfPathEmpty,
          title: dialogTitle,
        })
        .then((folder) => folder && setPath(folder));
    } else if (type === 'file') {
      noitaAPI.dialog
        .openFileDialog({
          startIn: path ?? startInIfPathEmpty,
          title: dialogTitle,
        })
        .then((file) => file && setPath(file));
    }
  };

  const toast = useToast();
  const { contextMenuEventHandler } = useContextMenuStore();
  const contextMenuOptions: ContextMenuItem[] = [
    {
      type: 'item',
      title: 'Open in Explorer',
      disabled: path !== undefined,
      action: () => {
        if (path === undefined) return;

        noitaAPI.dialog.openExplorer(path).catch((err) => {
          toast.error('Failed to open File Explorer');
          console.log(err);
        });
      },
    },
    {
      type: 'item',
      title: 'Copy',
      disabled: path !== undefined,
      action: () => {
        if (path === undefined) return;

        noitaAPI.clipboard
          .set(path)
          .then(() => toast.info('Path copied to clipboard'))
          .catch((err) => {
            toast.error('Failed to copy the path to clipboard');
            console.log(err);
          });
      },
    },
  ];

  return (
    <div>
      <div onContextMenu={contextMenuEventHandler(contextMenuOptions)}>
        <Button decoration={'right'} onClick={onPathSelect}>
          <span style={{ wordBreak: 'break-all' }}>{displayPath ?? path}</span>
        </Button>
      </div>
    </div>
  );
};
