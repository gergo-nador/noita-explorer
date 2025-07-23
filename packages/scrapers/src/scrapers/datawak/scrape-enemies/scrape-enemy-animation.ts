import {
  FileSystemDirectoryAccess,
  StringKeyDictionary,
} from '@noita-explorer/model';
import { NoitaScrapedGifWrapper } from '@noita-explorer/model-noita';
import { scrapeAnimations } from '../../common/scrape-animations/scrape-animations.ts';
import { AnimationInfo } from '../../common/scrape-animations/types.ts';

export const scrapeEnemyAnimation = async ({
  dataWakParentDirectoryApi,
  animationInfos,
}: {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  animationInfos: AnimationInfo[];
}): Promise<StringKeyDictionary<NoitaScrapedGifWrapper>> => {
  return scrapeAnimations({
    dataWakParentDirectoryApi,
    animationInfos,
  });
};
