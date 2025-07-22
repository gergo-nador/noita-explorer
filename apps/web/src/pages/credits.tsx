import { Button, Header, Icon } from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { deployUrls } from '../utils/deployUrls.ts';

export const Credits = () => {
  return (
    <div>
      <h1>Noita Explorer</h1>
      <p>
        Noita Explorer is a free, ad-free, open-source and fully client side
        tool to unlock perk, spell and enemy progress. It achieves it without
        mods, by directly modifying your save files.
      </p>
      <br />
      <Header title='Source code'>
        <Flex gap={4}>
          <Icon src={'/images/external/github.png'} alt='github' size={18} />

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
      </Header>

      {__ENV__ === 'production' && (
        <div>
          <br />
          <Header title='Beta testing'>
            <p>
              If you would like to help testing the newest features, check out
              the deployment of the development branch
              <a
                href={deployUrls.noitaExplorer.preview}
                style={{ color: 'white' }}
              >
                <Button decoration='right'>
                  {deployUrls.noitaExplorer.preview}
                </Button>
              </a>
            </p>
          </Header>
        </div>
      )}
      {__ENV__ === 'preview' && (
        <div>
          <br />
          <Header title='Main site'>
            <p>
              Bring me back to the main site
              <a
                href={deployUrls.noitaExplorer.production}
                style={{ color: 'white' }}
              >
                <Button decoration='right'>
                  {deployUrls.noitaExplorer.production}
                </Button>
              </a>
            </p>
          </Header>
        </div>
      )}
      {__ENV__ === 'development' && (
        <div>
          <br />
          <Header title='Deployed Urls'>
            <ul>
              <li>
                <div>
                  <span>Production:</span>
                  <ul>
                    <li>
                      <CreditsLink link={deployUrls.noitaExplorer.production}>
                        {deployUrls.noitaExplorer.production}
                      </CreditsLink>
                    </li>
                    <li>
                      <CreditsLink link={deployUrls.cloudflare.production}>
                        {deployUrls.cloudflare.production}
                      </CreditsLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div>
                  <span>Preview:</span>
                  <ul>
                    <li>
                      <CreditsLink link={deployUrls.noitaExplorer.preview}>
                        {deployUrls.noitaExplorer.preview}
                      </CreditsLink>
                    </li>
                    <li>
                      <CreditsLink link={deployUrls.cloudflare.preview}>
                        {deployUrls.cloudflare.preview}
                      </CreditsLink>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </Header>
        </div>
      )}
      <br />
      <Header title='Thank you'>
        <p>
          Thank you for these amazing projects, wiki and users who heavily
          inspired Noita Explorer:
        </p>
        <ul>
          <li>
            <CreditsLink link='https://github.com/TwoAbove/noita-tools'>
              [Github] TwoAbove / noita-tools
            </CreditsLink>
          </li>
          <li>
            <CreditsLink link='https://github.com/ipeterov/noita-progress'>
              [Github] ipeterov / noita-progress
            </CreditsLink>
          </li>
          <li>
            <CreditsLink link='https://github.com/Takiro/noita-savegame-editor'>
              [Github] Takiro / noita-savegame-editor
            </CreditsLink>
          </li>
          <li>
            <CreditsLink link='https://github.com/acidflow-noita/noitamap'>
              [Github] acidflow-noita / noitamap
            </CreditsLink>
          </li>
          <li>
            <CreditsLink link='https://github.com/kamiheku/noited'>
              [Github] kamiheku / noited
            </CreditsLink>
          </li>
          <li>
            <CreditsLink link='https://github.com/isJuhn/UnWak'>
              [Github] isJuhn / UnWak
            </CreditsLink>
          </li>
          <li>
            <CreditsLink link='https://www.lightbourn.net/games/Noita/editor.html'>
              Noita .salakieli Editor
            </CreditsLink>
          </li>
          <li>
            <CreditsLink link='https://noita.wiki.gg/wiki/Noita_Wiki'>
              Noita Wiki
            </CreditsLink>
          </li>
          <li>
            <CreditsLink link='https://www.reddit.com/r/noita/comments/yzajqv/i_made_a_simplified_map_while_still_keeping_all/'>
              [Reddit] Noita map for the Death map from u/lilraz08
            </CreditsLink>
          </li>
          <li>
            <CreditsLink link='https://www.reddit.com/r/noita/comments/jp56ub/a_while_ago_i_made_noita_blackletter_this_is_now/'>
              [Reddit] Noita Backletter font from u/Viowlet
            </CreditsLink>
          </li>
        </ul>
      </Header>
      <br />
      <br />
      <br />
      <Flex gap={10} center className='text-secondary'>
        <span>{__DEPLOY_ID__}</span>
        <span>-</span>
        <span>{new Date(parseInt(__DEPLOY_TIME__)).toLocaleString()}</span>
      </Flex>
    </div>
  );
};

const CreditsLink = ({
  children,
  link,
}: {
  children: string;
  link: string;
}) => {
  // The <Flex> wrapper is needed for Firefox compatibility, otherwise
  // the links are misaligned
  return (
    <Flex>
      <a href={link} target='_blank' style={{ color: 'white' }}>
        <Button decoration='right'>{children}</Button>
      </a>
    </Flex>
  );
};
