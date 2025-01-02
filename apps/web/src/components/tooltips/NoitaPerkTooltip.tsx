import { NoitaPerk } from '@noita-explorer/model';

interface NoitaPerkTooltipProps {
  perk: NoitaPerk;
  isUnknown?: boolean;
}

export const NoitaPerkTooltip = ({
  perk,
  isUnknown,
}: NoitaPerkTooltipProps) => {
  if (isUnknown) {
    return <div>???</div>;
  }

  return (
    <div style={{ maxWidth: '400px', minWidth: '300px', lineHeight: '16px' }}>
      <div style={{ fontSize: 20, marginBottom: 15 }}>{perk.name}</div>

      <div>{perk.description}</div>
    </div>
  );
};
