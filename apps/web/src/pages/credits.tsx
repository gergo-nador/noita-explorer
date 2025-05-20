import github from '../assets/external/github.png';
import { Button, Icon } from '@noita-explorer/noita-component-library';
import { Flex } from '../components/flex.tsx';
import { deployUrls, environment } from '../environment.ts';

export const Credits = () => {
  return (
    <div>
      <h1>Noita Explorer</h1>
      <p>
        Noita Explorer is a free, ad-free, open-source and fully client side
        tool to unlock perk, spell and enemy progress. It achieves it without
        mods, by directly modifying your save files.
      </p>
      <Flex gap={4}>
        <Icon type='custom' src={github} alt='github' size={18} />

        <a
          href='https://github.com/gergo-nador/noita-explorer'
          target='_blank'
          style={{ color: 'white' }}
        >
          <Button decoration='right'>
            https://github.com/gergo-nador/noita-explorer
          </Button>
        </a>
      </Flex>

      {environment === 'production' && (
        <div>
          <br />
          <h2>Beta testing</h2>

          <p>
            If you would like to help testing the newest features, check out the
            deployment of the development branch
            <a href={deployUrls.preview} style={{ color: 'white' }}>
              <Button decoration='right'>{deployUrls.preview}</Button>
            </a>
          </p>
        </div>
      )}
      {environment === 'preview' && (
        <div>
          <br />
          <h2>Main site</h2>

          <p>
            Bring me back to the main site
            <a href={deployUrls.production} style={{ color: 'white' }}>
              <Button decoration='right'>{deployUrls.production}</Button>
            </a>
          </p>
        </div>
      )}
      {environment === 'development' && (
        <div>
          <br />
          <h2>Deployed Urls</h2>
          <ul>
            <li>
              <Flex gap={8}>
                <span>Production:</span>
                <a href={deployUrls.production} style={{ color: 'white' }}>
                  <Button decoration='right'>{deployUrls.production}</Button>
                </a>
              </Flex>
            </li>
            <li>
              <Flex gap={8}>
                <span>Preview:</span>
                <a href={deployUrls.preview} style={{ color: 'white' }}>
                  <Button decoration='right'>{deployUrls.preview}</Button>
                </a>
              </Flex>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
