import { MultiSelection } from './MultiSelection.tsx';

interface MultiSelectionBooleanProps {
  setValue: (value: boolean | undefined) => void;
  currentValue: boolean | undefined;
}

export const MultiSelectionBoolean = ({
  setValue,
  currentValue,
}: MultiSelectionBooleanProps) => {
  return (
    <MultiSelection<boolean | undefined>
      options={[
        {
          id: 'no',
          display: 'No',
          value: false,
          selectedProperties: {
            color: '#de4646',
          },
        },
        {
          id: 'undefined',
          display: '-',
          value: undefined,
          style: { fontSize: 20 },
        },
        {
          id: 'yes',
          display: 'Yes',
          value: true,
          selectedProperties: {
            color: '#87bf1c',
          },
        },
      ]}
      setValue={setValue}
      currentValue={currentValue}
    />
  );
};
