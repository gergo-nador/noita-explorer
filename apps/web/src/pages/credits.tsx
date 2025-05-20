import github from '../assets/external/github.png';
import { Icon } from '@noita-explorer/noita-component-library';

export const Credits = () => {
  return (
    <div>
      <h1>Noita Explorer</h1>
      <p>
        Noita Explorer is a free, ad-free, open-source and fully client side
        tool to unlock perk, spell and enemy progress. It achieves it without
        mods, by directly modifying your save files.
      </p>

      <Icon type='custom' src={github} alt='github' size={40} />
    </div>
  );
};
