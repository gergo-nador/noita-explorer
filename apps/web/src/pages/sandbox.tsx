import { useEffect, useState } from 'react';
import { getSave00FolderHandle } from '../utils/browser-noita-api/browser-noita-api.ts';
import { FileSystemFileAccess } from '@noita-explorer/model';
import { useSave00Store } from '../stores/save00.ts';
import { testParseChunk } from '@noita-explorer/map';

export const Sandbox = () => {
  const { status } = useSave00Store();
  const [petriFiles, setFiles] = useState<FileSystemFileAccess[]>([]);

  useEffect(() => {
    if (status !== 'loaded') return;

    getSave00FolderHandle()
      .then((folder) => folder.getDirectory('world'))
      .then((folder) => folder.listFiles())
      .then((files) =>
        files.filter((file) => file.getName().endsWith('.png_petri')),
      )
      .then((files) => setFiles(files));
  }, [status]);

  return (
    <div style={{ width: '100%', height: '90vh', zIndex: 1 }}>
      <div>{status}</div>
      {petriFiles?.map((file) => (
        <div onClick={() => testParseChunk(file)}>{file.getName()}</div>
      ))}
    </div>
  );
};
