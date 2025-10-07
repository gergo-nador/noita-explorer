import { parseReactionMaterial } from './material-reaction.utils.ts';
import { NoitaMaterialLink } from '../../../../components/noita-material-link.tsx';

interface Props {
  reactionComponent: string;
}

export const MaterialReactionComponent = ({ reactionComponent }: Props) => {
  const reactionMaterial = parseReactionMaterial(reactionComponent);

  if (reactionMaterial.type === 'material-id') {
    return (
      <div>
        <NoitaMaterialLink materialId={reactionMaterial.id} isInline />
      </div>
    );
  }

  return <div>{reactionComponent}</div>;
};
