import { NoitaMaterialLink } from '../../../../components/noita-material-link.tsx';
import { MaterialReactionProcessed } from './material-reaction.types.ts';

interface Props {
  reactionComponent: MaterialReactionProcessed;
}

export const MaterialReactionComponent = ({ reactionComponent }: Props) => {
  const reactionMaterial = reactionComponent.parsed;
  const materialId =
    reactionComponent.overrideComponentId ||
    (reactionMaterial.type === 'material-id' && reactionMaterial.id);

  if (materialId) {
    return (
      <div>
        <NoitaMaterialLink materialId={materialId} isInline />
      </div>
    );
  }

  return <div>{reactionComponent.componentId}</div>;
};
