import { MultiSelection } from './multi-selection.tsx';

interface Props {
  setValue: (value: boolean) => void;
  currentValue: boolean;
}

export const MultiSelectionBoolean = ({ setValue, currentValue }: Props) => {
  return (
    <MultiSelection<boolean>
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
