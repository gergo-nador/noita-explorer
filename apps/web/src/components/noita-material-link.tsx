import { Link } from './link.tsx';
import { pages } from '../routes/pages.ts';
import { Flex } from '@noita-explorer/react-utils';
import { useNoitaDataWakStore } from '../stores/noita-data-wak.ts';
import { Icon } from '@noita-explorer/noita-component-library';
import { NoitaMaterialIcon } from './noita-material-icon.tsx';

interface Props {
  materialId: string;
  name?: string;
  isInline?: boolean;
  forcePotion?: boolean;
}

export const NoitaMaterialLink = ({
  materialId,
  name,
  isInline,
  forcePotion,
}: Props) => {
  const { data } = useNoitaDataWakStore();
  name ??= materialId;

  if (!data) return <span>{name}</span>;

  const material = data?.materials?.find(
    (material) => material.id === materialId,
  );
  if (!material) {
    return (
      <span>
        {name} <Icon type='warning' />
      </span>
    );
  }

  return (
    <Link
      to={pages.wiki.materialDetail(materialId)}
      isInline={isInline}
      buttonDecoration={isInline ? 'none' : 'both'}
    >
      <Flex gap={4}>
        <span>{material.name}</span>
        <div style={{ width: '20px', height: '20px' }}>
          <NoitaMaterialIcon material={material} forcePotion={forcePotion} />
        </div>
      </Flex>
    </Link>
  );
};
