import { useEffect, useState } from 'react';
import { getSave00FolderHandle } from '../utils/browser-noita-api/browser-noita-api.ts';
import { FileSystemFileAccess } from '@noita-explorer/model';
import { useSave00Store } from '../stores/save00.ts';
import { Buffer } from 'buffer';

export const Sandbox = () => {
  const { status } = useSave00Store();
  const [files, setFiles] = useState<FileSystemFileAccess[]>([]);

  useEffect(() => {
    if (status !== 'loaded') return;

    getSave00FolderHandle()
      .then((folder) => folder.getDirectory('world'))
      .then((folder) => folder.listFiles())
      .then((files) => setFiles(files));
  }, [status]);

  const petriFiles = files?.filter((file) =>
    file.getName().endsWith('.png_petri'),
  );

  const petriFile = petriFiles[0];

  return (
    <div style={{ width: '100%', height: '90vh', zIndex: 1 }}>
      <div>{status}</div>
      {petriFiles?.map((file) => (
        <div>{file.getName()}</div>
      ))}

      {petriFile && <PetriFile file={petriFile} />}
    </div>
  );
};

const PetriFile = ({ file }: { file: FileSystemFileAccess }) => {
  const [fileData, setFileData] = useState<{ version: number }>();
  useEffect(() => {
    getFileData(file).then((data) => setFileData(data));
  }, []);

  return (
    fileData && (
      <div>
        <div>version: {fileData.version}</div>
      </div>
    )
  );
};

const getFileData = async (file: FileSystemFileAccess) => {
  import('/fastlz/main.es.js').then((module) => {
    console.log(module);
  });
  return;
  const compressor = await createFastLzCompressor();
  const readBuffer = await file.read.asBuffer();
  const buffer = Buffer.from(readBuffer);
  const decompressed = compressor.decompressBuffer(buffer.subarray(8));

  return {
    version: decompressed.readInt32BE(),
  };
};
