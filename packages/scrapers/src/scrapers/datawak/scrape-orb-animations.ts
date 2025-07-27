import { scrapeAnimations } from '../common/scrape-animations/scrape-animations.ts';
import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { enumerateHelpers } from '@noita-explorer/tools';
import { AnimationInfo } from '../common/scrape-animations/types.ts';
import { noitaPaths } from '../../noita-paths.ts';

export const scrapeOrbAnimations = async ({
  dataWakParentDirectoryApi,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}) => {
  const mainOrbIds = enumerateHelpers.range(0, 12);
  const mainOrbs = mainOrbIds.map((id) => String(id).padStart(2, '0'));

  const extraOrbs = ['discovered', 'picked', 'red', 'red_evil'];

  const animationInfos = [...mainOrbs, ...extraOrbs].map(
    async (o): Promise<AnimationInfo> => {
      const orbId = 'orb_' + o;
      const path = await dataWakParentDirectoryApi.path.join([
        ...noitaPaths.noitaDataWak.orbs,
        orbId + '.xml',
      ]);

      const file = await dataWakParentDirectoryApi.getFile(path);

      return {
        id: orbId,
        file: file,
      };
    },
  );

  return scrapeAnimations({
    animationInfos: await Promise.all(animationInfos),
    dataWakParentDirectoryApi: dataWakParentDirectoryApi,
  });
};
