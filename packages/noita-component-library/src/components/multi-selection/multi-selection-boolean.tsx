import { MultiSelection } from './multi-selection.tsx';

interface Props {
  setValue: (value: boolean) => void;
  currentValue: boolean;
}

export const MultiSelectionBoolean = ({ setValue, currentValue }: Props) => {
  const MultiSelectionBool = MultiSelection<boolean>();

  return (
    <MultiSelectionBool setValue={setValue} currentValue={currentValue}>
      <MultiSelectionBool.Item
        value={false}
        selectedProperties={{ color: '#de4646' }}
      >
        No
      </MultiSelectionBool.Item>
      <MultiSelectionBool.Item
        value={true}
        selectedProperties={{ color: '#87bf1c' }}
      >
        Yes
      </MultiSelectionBool.Item>
    </MultiSelectionBool>
  );
};
