import { BooleanIcon } from '@noita-explorer/noita-component-library';
import { NoitaPetriFileCollection } from '../../noita-map.types.ts';

interface Props {
  petriFileCollection: NoitaPetriFileCollection;
}

export const PetriFilesLoader = ({ petriFileCollection }: Props) => {
  if (petriFileCollection) {
    const length = Object.values(petriFileCollection)
      .map((o) => Object.values(o))
      .flat(2).length;

    return (
      <>
        <span>Petri files loaded: {length}</span>
        <BooleanIcon value={true} />
      </>
    );
  }

  return <span>Loading petri files...</span>;
};
