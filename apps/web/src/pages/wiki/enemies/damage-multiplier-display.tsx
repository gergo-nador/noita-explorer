import {
  Icon,
  NoitaTooltipWrapper,
} from '@noita-explorer/noita-component-library';

interface Props {
  name: string;
  icon: string;
  iconColor: string;
  value: number;
}

export const DamageMultiplierDisplay = ({
  name,
  icon,
  iconColor,
  value,
}: Props) => {
  let color = 'inherit';
  if (value === 0) color = '#FFAABB';
  else if (value < 0) color = '#EE8866';
  else if (value < 1) color = '#EEDD88';
  else if (value > 1) color = '#44BB99';

  // the icons are 7x7, 21 is divisible by 7, so the icons
  // will look natural
  const iconSize = 21;

  return (
    <div>
      <NoitaTooltipWrapper content={name}>
        <div style={{ width: 'fit-content' }}>
          {value === 1 && <Icon src={icon} size={iconSize} />}
          {value !== 1 && <Icon src={iconColor} size={iconSize} />}
          <span style={{ color: color }}> {value}</span>
        </div>
      </NoitaTooltipWrapper>
    </div>
  );
};
