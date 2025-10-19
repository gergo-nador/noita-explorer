import { useParams } from 'react-router-dom';
import { useNoitaDataWakStore } from '../../../stores/noita-data-wak.ts';
import { SeoDefaultPage } from '@noita-explorer/react-utils';
import { MaterialOverview } from './material-overview.tsx';

export const WikiMaterialDetails = () => {
  const { materialId } = useParams();
  const { lookup } = useNoitaDataWakStore();

  if (!lookup?.materials) {
    return <div>Data wak is loading</div>;
  }

  if (!materialId) {
    return <div>Material Id empty</div>;
  }

  const material = lookup.materials[materialId];
  if (!material) {
    return (
      <div>
        Material was not found with id <i>{materialId}</i>
      </div>
    );
  }

  return (
    <>
      <SeoDefaultPage
        title={material?.name ?? 'Materials - Wiki'}
        description={material?.id ?? 'Browse any in-game material.'}
      />
      <main>
        {!material && <div style={{ padding: 8 }}>Select a material</div>}
        {material && <MaterialOverview key={material.id} material={material} />}
      </main>
    </>
  );
};
