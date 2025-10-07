import { NoitaMaterialReaction } from '@noita-explorer/model-noita';
import { Card } from '@noita-explorer/noita-component-library';
import { MaterialReactionComponent } from './material-reaction-component.tsx';

interface Props {
  reaction: NoitaMaterialReaction;
}

export const MaterialReaction = ({ reaction }: Props) => {
  return (
    <Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr' }}>
        <div>
          {reaction.inputComponents.map((component) => (
            <MaterialReactionComponent
              reactionComponent={component.componentId}
            />
          ))}
        </div>
        <div>{'-->'}</div>
        <div>
          {reaction.outputComponents.map((component) => (
            <MaterialReactionComponent
              reactionComponent={component.componentId}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
