import { SpellModifierNumberUnit } from '@noita-explorer/model-noita';
import { switchStatement } from '@noita-explorer/tools';

export const NoitaNumberModifier = ({
  modifier,
  unitDisplayCallback,
}: {
  modifier: SpellModifierNumberUnit | undefined;
  unitDisplayCallback?: (value: number) => string;
}) => {
  if (modifier === undefined) {
    return <div></div>;
  }

  const operator: string | undefined = switchStatement(modifier.operator).cases(
    {
      '*': 'x',
      __default: modifier.operator,
    },
  );

  return (
    <div>
      {operator}
      {unitDisplayCallback !== undefined
        ? unitDisplayCallback(modifier.value)
        : modifier?.value}
    </div>
  );
};
