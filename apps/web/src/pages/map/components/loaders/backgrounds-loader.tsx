import { BooleanIcon } from '@noita-explorer/noita-component-library';
import { StreamInfoBackground } from '@noita-explorer/model-noita';

interface Props {
  backgrounds: Record<number, Record<number, StreamInfoBackground[]>>;
  isLoaded: boolean;
}

export const BackgroundsLoader = ({ backgrounds, isLoaded }: Props) => {
  if (isLoaded) {
    const numOfBackgrounds = Object.values(backgrounds)
      .map((o) => Object.values(o))
      .flat(2).length;

    return (
      <>
        <span>Backgrounds loaded: {numOfBackgrounds}</span>
        <BooleanIcon value={true} />
      </>
    );
  }

  return <span>Loading backgrounds...</span>;
};
