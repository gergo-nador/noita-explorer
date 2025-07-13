import { scrapeAnimations } from '../common/scrape-animations/scrape-animations.ts';
import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { noitaPaths } from '../../noita-paths.ts';
import { enumerateHelpers } from '@noita-explorer/tools';

export const scrapeOrbAnimations = ({
  dataWakParentDirectoryApi,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}) => {
  const mainOrbIds = enumerateHelpers.range(0, 12);
  const mainOrbs = mainOrbIds.map((id) => String(id).padStart(2, '0'));

  const extraOrbs = ['discovered', 'picked', 'red', 'red_evil'];

  return scrapeAnimations({
    animationInfos: [...mainOrbs, ...extraOrbs].map((o) => ({
      id: 'orb_' + o,
    })),
    dataWakParentDirectoryApi: dataWakParentDirectoryApi,
    animationsPath: noitaPaths.noitaDataWak.orbs,
  });
};
