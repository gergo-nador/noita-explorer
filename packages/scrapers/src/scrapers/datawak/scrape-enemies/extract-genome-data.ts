import { XmlWrapperType } from '@noita-explorer/tools/xml';
import { NoitaGenomeData } from '@noita-explorer/model-noita';

export const extractGenomeData = ({
  genomeDataComponent,
  genomeData,
}: {
  genomeDataComponent: XmlWrapperType;
  genomeData: NoitaGenomeData | undefined;
}) => {
  const herdId = genomeDataComponent.getAttribute('herd_id')?.asText();

  const foodChainRank = genomeDataComponent
    .getAttribute('food_chain_rank')
    ?.asInt();

  const isPredator = genomeDataComponent
    .getAttribute('is_predator')
    ?.asBoolean();

  if (genomeData === undefined) {
    genomeData = {
      herdId: undefined,
      isPredator: undefined,
      foodChainRank: undefined,
    };
  }

  genomeData.herdId = herdId ?? genomeData.herdId;
  genomeData.foodChainRank = foodChainRank ?? genomeData.foodChainRank;
  genomeData.isPredator = isPredator ?? genomeData.isPredator;

  return genomeData;
};
