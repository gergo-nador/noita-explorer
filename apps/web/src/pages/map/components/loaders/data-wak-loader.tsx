import {
  BooleanIcon,
  ProgressBar,
} from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';

interface Props {
  progress: number | undefined;
  dataWakBuffer: Buffer<ArrayBufferLike> | undefined;
}
export const DataWakLoader = ({ dataWakBuffer, progress }: Props) => {
  if (dataWakBuffer) {
    return (
      <>
        <span>Assets loaded</span>
        <BooleanIcon value={true} />
      </>
    );
  }

  return (
    <Flex gap={10}>
      <span>Loading game assets...</span>
      {progress !== undefined && (
        <ProgressBar progress={progress} barColor='healthBar' width={250} />
      )}
    </Flex>
  );
};
