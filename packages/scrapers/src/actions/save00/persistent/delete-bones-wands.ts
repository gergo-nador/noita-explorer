import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { noitaPaths } from '../../../noita-paths.ts';

export const deleteBonesWands = async ({
  save00DirectoryApi,
  bonesWandFileName,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
  bonesWandFileName: string;
}) => {
  const bonesDirPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.bones_new,
  );
  const bonesDir = await save00DirectoryApi.getDirectory(bonesDirPath);
  const file = await bonesDir.getFile(bonesWandFileName);
  await file.delete();
};
