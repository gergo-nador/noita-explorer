import { useParams } from 'react-router-dom';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { SeoDefaultPage } from '@noita-explorer/react-utils';
import { MaterialOverview } from './material-overview.tsx';

export const WikiMaterialDetails = () => {
  const { materialId } = useParams();
  const { data } = useNoitaDataWakStore();

  if (!data?.materials) {
    return <div>Data wak is loading</div>;
  }

  const material = data.materials.find(
    (material) => material.id === materialId,
  );

  return (
    <>
      <SeoDefaultPage
        title={material?.name ?? 'Materials - Wiki'}
        description={material?.id ?? 'Browse any in-game material.'}
      />
      <div>
        {!material && <span>Select a material</span>}
        {material && <MaterialOverview key={material.id} material={material} />}
      </div>
    </>
  );
};
