import { Icon } from './icons/icon';

interface BooleanIconProps {
  value: boolean | undefined;
}

export const BooleanIcon = ({ value }: BooleanIconProps) => {
  return value ? (
    <Icon type='check' alt='Yes' size={16} />
  ) : (
    <Icon type='cross' alt='No' size={16} />
  );
};
