import { NoitaMaterialReaction } from '@noita-explorer/model-noita';

interface Props {
  reaction: NoitaMaterialReaction;
}

export const MaterialReaction = ({ reaction }: Props) => {
  return <div>Reaction {reaction.convertAll}</div>;
};
