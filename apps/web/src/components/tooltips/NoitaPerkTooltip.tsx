import { NoitaPerk } from '@noita-explorer/model-noita';
import { NoitaUnknownTooltip } from './NoitaUnknownTooltip.tsx';

interface NoitaPerkTooltipProps {
  perk: NoitaPerk;
  isUnknown?: boolean;
}

export const NoitaPerkTooltip = ({
  perk,
  isUnknown,
}: NoitaPerkTooltipProps) => {
  if (isUnknown) {
    return <NoitaUnknownTooltip />;
  }

  return (
    <div style={{ maxWidth: '400px', minWidth: '300px', lineHeight: '16px' }}>
      <div style={{ fontSize: 20, marginBottom: 15 }}>{perk.name}</div>

      <div>{perk.description}</div>
    </div>
  );
};
