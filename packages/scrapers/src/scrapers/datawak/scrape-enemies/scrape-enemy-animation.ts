import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { scrapeAnimations } from '../../common/scrape-animations/scrape-animations.ts';
import { AnimationInfo } from '../../common/scrape-animations/types.ts';
import { NoitaScrapedMediaGif } from '@noita-explorer/model-noita';

export const scrapeEnemyAnimation = async ({
  dataWakParentDirectoryApi,
  animationInfos,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  animationInfos: AnimationInfo[];
}): Promise<StringKeyDictionary<NoitaScrapedMediaGif>> => {
  return scrapeAnimations({
    dataWakParentDirectoryApi,
    animationInfos,
  });
};
