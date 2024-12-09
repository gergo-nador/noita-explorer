import { Button } from './Button';
import { noitaAPI } from '../../ipcHandlers';
import { ContextMenuItem, useContextMenuStore } from '../../stores/contextmenu';
import { useToast } from '../../hooks/useToast';

interface PathInputProps {
  path?: string;
  displayPath?: string;
  setPath: (path: string) => void;
  dialogTitle?: string;
  type: 'file' | 'directory';
}

export const PathInput = ({
  path,
  displayPath,
  setPath,
  dialogTitle,
  type,
}: PathInputProps) => {
  const onPathSelect = () => {
    if (type === 'directory') {
      noitaAPI.dialog
        .openFolderDialog({ startIn: path, title: dialogTitle })
        .then((folder) => folder && setPath(folder));
    } else if (type === 'file') {
      noitaAPI.dialog
        .openFileDialog({ startIn: path, title: dialogTitle })
        .then((file) => file && setPath(file));
    }
  };

  const toast = useToast();
  const { contextMenuEventHandler } = useContextMenuStore();
  const contextMenuOptions: ContextMenuItem[] = [
    {
      type: 'item',
      title: 'Open in Explorer',
      action: () => {
        noitaAPI.dialog.openExplorer(path).catch((err) => console.log(err));
      },
    },
    {
      type: 'item',
      title: 'Copy',
      action: () => {
        noitaAPI.clipboard
          .set(path)
          .then(() => toast.info('Path copied to clipboard'))
          .catch((err) => console.log(err));
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
