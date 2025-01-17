import { useSave00Store } from '../../stores/save00.ts';

export const CurrentRunPage = () => {
  const { currentRun } = useSave00Store();

  if (currentRun === undefined) {
    return <div>No ongoing run detected.</div>;
  }

  return (
    <div>
      <div>Run type: {currentRun.worldState.runType}</div>
      <br />
      <div>
        Perks picked:{' '}
        {currentRun.worldState.perks.pickedPerks
          .map((p) => p.perkId)
          .join(', ')}
      </div>
      <br />
      <div>
        Fungal Shifts:
        {currentRun.worldState.fungalShifts.map((f) => (
          <div>
            {f.fromMaterials.join(', ')} --{'>'} {f.toMaterials.join(', ')}
          </div>
        ))}
      </div>
      <br />
      <div>
        Mods active:{' '}
        {currentRun.worldState.modsActiveDuringThisRun ? 'yes' : 'no'}
      </div>
      <br />
      <div>days: {currentRun.worldState.dayCount}</div>
    </div>
  );
};
