import { Header, Icon } from '@noita-explorer/noita-component-library';
import { Flex } from '@noita-explorer/react-utils';
import { deployUrls } from '../utils/deploy-urls.ts';
import { Link } from '../components/link.tsx';
import { publicPaths } from '../utils/public-paths.ts';

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
          <Icon src='/images/external/github.png' alt='github' size={18} />
          <Link
            to='https://github.com/gergo-nador/noita-explorer'
            external
            buttonDecoration='right'
          >
            https://github.com/gergo-nador/noita-explorer
          </Link>
        </Flex>
      </Header>

      {__ENV__ === 'production' && (
        <div>
          <br />
          <Header title='Beta testing'>
            <span>
              If you would like to help testing the newest features, check out
              the deployment of the development branch
            </span>
            <Link
              to={deployUrls.noitaExplorer.preview}
              external
              buttonDecoration='right'
            >
              {deployUrls.noitaExplorer.preview}
            </Link>
          </Header>
        </div>
      )}
      {__ENV__ === 'preview' && (
        <div>
          <br />
          <Header title='Main site'>
            <span>Bring me back to the main site</span>
            <Link
              to={deployUrls.noitaExplorer.production}
              external
              buttonDecoration='right'
            >
              {deployUrls.noitaExplorer.production}
            </Link>
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
                      <Link
                        to={deployUrls.noitaExplorer.production}
                        external
                        buttonDecoration='right'
                      >
                        {deployUrls.noitaExplorer.production}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={deployUrls.cloudflare.production}
                        external
                        buttonDecoration='right'
                      >
                        {deployUrls.cloudflare.production}
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div>
                  <span>Preview:</span>
                  <ul>
                    <li>
                      <Link
                        to={deployUrls.noitaExplorer.preview}
                        external
                        buttonDecoration='right'
                      >
                        {deployUrls.noitaExplorer.preview}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={deployUrls.cloudflare.preview}
                        external
                        buttonDecoration='right'
                      >
                        {deployUrls.cloudflare.preview}
                      </Link>
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
            <Link
              to='https://github.com/pudy248/NoitaMapViewer'
              external
              buttonDecoration='right'
            >
              [Github] pudy248 / NoitaMapViewer
            </Link>
            <div>
              Thanks Pudy248 for all the help you provided during the
              development of the map viewer
              <Icon
                src={publicPaths.static.dataWak.misc('heart')}
                size={20}
                style={{ marginLeft: '8px' }}
              />
            </div>
          </li>
          <li>
            <Link
              to='https://github.com/chairclr/NoitaMap'
              external
              buttonDecoration='right'
            >
              [Github] chairclr / NoitaMap
            </Link>
          </li>
          <li>
            <Link
              to='https://github.com/NathanSnail/entity_bin'
              external
              buttonDecoration='right'
            >
              [Github] NathanSnail / entity_bin
            </Link>
          </li>
          <li>
            <Link
              to='https://github.com/TwoAbove/noita-tools'
              external
              buttonDecoration='right'
            >
              [Github] TwoAbove / noita-tools
            </Link>
          </li>
          <li>
            <Link
              to='https://github.com/ipeterov/noita-progress'
              external
              buttonDecoration='right'
            >
              [Github] ipeterov / noita-progress
            </Link>
          </li>
          <li>
            <Link
              to='https://github.com/Takiro/noita-savegame-editor'
              external
              buttonDecoration='right'
            >
              [Github] Takiro / noita-savegame-editor
            </Link>
          </li>
          <li>
            <Link
              to='https://github.com/acidflow-noita/noitamap'
              external
              buttonDecoration='right'
            >
              [Github] acidflow-noita / noitamap
            </Link>
          </li>
          <li>
            <Link
              to='https://github.com/kamiheku/noited'
              external
              buttonDecoration='right'
            >
              [Github] kamiheku / noited
            </Link>
          </li>
          <li>
            <Link
              to='https://github.com/isJuhn/UnWak'
              external
              buttonDecoration='right'
            >
              [Github] isJuhn / UnWak
            </Link>
          </li>
          <li>
            <Link
              to='https://www.lightbourn.net/games/Noita/editor.html'
              external
              buttonDecoration='right'
            >
              Noita .salakieli Editor
            </Link>
          </li>
          <li>
            <Link
              to='https://noita.wiki.gg/wiki/Noita_Wiki'
              external
              buttonDecoration='right'
            >
              Noita Wiki
            </Link>
          </li>
          <li>
            <Link
              to='https://www.reddit.com/r/noita/comments/yzajqv/i_made_a_simplified_map_while_still_keeping_all/'
              external
              buttonDecoration='right'
            >
              [Reddit] Noita map for the Death map from u/lilraz08
            </Link>
          </li>
          <li>
            <Link
              to='https://www.reddit.com/r/noita/comments/jp56ub/a_while_ago_i_made_noita_blackletter_this_is_now/'
              external
              buttonDecoration='right'
            >
              [Reddit] Noita Backletter font from u/Viowlet
            </Link>
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
