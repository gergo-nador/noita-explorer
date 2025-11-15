import { BooleanIcon } from '@noita-explorer/noita-component-library';

interface Props {
  total: number;
  processed: number;
  error?: string;
}

export const EntitiesLoader = ({ total, processed, error }: Props) => {
  if (error) {
    return <div>Entity load error: {error}</div>;
  }

  if (processed !== total) {
    return (
      <div>
        Loading entities {processed} / {total}
      </div>
    );
  }

  return (
    <div>
      Entities loaded <BooleanIcon value={true} />
    </div>
  );
};
