import { NoitaMaterialReaction } from '@noita-explorer/model-noita';
import { Card } from '@noita-explorer/noita-component-library';

interface Props {
  reaction: NoitaMaterialReaction;
}

export const MaterialReaction = ({ reaction }: Props) => {
  return (
    <Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr' }}>
        <div>
          {reaction.inputComponents.map((component) => (
            <div>{component.componentId}</div>
          ))}
        </div>
        <div>{'-->'}</div>
        <div>
          {reaction.outputComponents.map((component) => (
            <div>{component.componentId}</div>
          ))}
        </div>
      </div>
    </Card>
  );
};
