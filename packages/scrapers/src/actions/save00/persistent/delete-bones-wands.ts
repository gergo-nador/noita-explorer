import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { noitaPaths } from '../../../noita-paths.ts';
import { BonesDeleteFileAction } from '@noita-explorer/model-noita';

export const deleteBonesWands = async ({
  save00DirectoryApi,
  action,
}: {
  save00DirectoryApi: FileSystemDirectoryAccess;
  action: BonesDeleteFileAction;
}) => {
  const bonesWandFileName = action.payload.bonesFileName;
  const bonesDirPath = await save00DirectoryApi.path.join(
    noitaPaths.save00.bones_new,
  );

  const bonesDir = await save00DirectoryApi.getDirectory(bonesDirPath);
  const file = await bonesDir.getFile(bonesWandFileName);
  await file.delete();
};
