import { MultiSelection } from './multi-selection.tsx';

interface Props {
  setValue: (value: boolean | undefined) => void;
  currentValue: boolean | undefined;
}

export const MultiSelectionBooleanNullable = ({
  setValue,
  currentValue,
}: Props) => {
  const MultiSelectionBooleanNullable = MultiSelection<boolean | undefined>();
  return (
    <MultiSelectionBooleanNullable
      setValue={setValue}
      currentValue={currentValue}
    >
      <MultiSelectionBooleanNullable.Item
        value={false}
        selectedProperties={{ color: '#de4646' }}
      >
        No
      </MultiSelectionBooleanNullable.Item>
      <MultiSelectionBooleanNullable.Item
        value={undefined}
        style={{ fontSize: 20 }}
      >
        -
      </MultiSelectionBooleanNullable.Item>
      <MultiSelectionBooleanNullable.Item
        value={true}
        selectedProperties={{ color: '#87bf1c' }}
      >
        Yes
      </MultiSelectionBooleanNullable.Item>
    </MultiSelectionBooleanNullable>
  );
};
