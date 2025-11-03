import { FileSystemDirectoryAccess } from '@noita-explorer/model';

interface Props {
  dataWakDirectory: FileSystemDirectoryAccess;
  path: string;
}

export async function getDataWakImage({ dataWakDirectory, path }: Props) {
  const file = await dataWakDirectory.getFile(path);

  const fileBuffer = await file.read.asBuffer();
  const arrayBuffer = fileBuffer.buffer as ArrayBuffer;

  const blob = new Blob([arrayBuffer], { type: 'image/png' });
  const imageBitmap = await createImageBitmap(blob);
  return imageBitmap;
}
