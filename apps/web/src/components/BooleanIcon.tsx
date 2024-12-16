import { Icon } from '@noita-explorer/noita-component-library';

interface BooleanIconProps {
  value: boolean;
}

export const BooleanIcon = ({ value }: BooleanIconProps) => {
  return value ? (
    <Icon type={'check'} alt={'Yes'} size={16} />
  ) : (
    <Icon type={'cross'} alt={'No'} size={16} />
  );
};
