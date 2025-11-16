import { BooleanIcon, Button } from '@noita-explorer/noita-component-library';

interface Props {
  total: number;
  processed: number;
  error?: string;
  onErrorContinueAnyway: VoidFunction;
}

export const EntitiesLoader = ({
  total,
  processed,
  error,
  onErrorContinueAnyway,
}: Props) => {
  if (error) {
    return (
      <div>
        <div className='text-danger'>Entity load error: {error}</div>
        <Button onClick={onErrorContinueAnyway}>Continue anyway</Button>
      </div>
    );
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
