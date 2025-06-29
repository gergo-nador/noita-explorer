import { sentry } from '../../utils/sentry.ts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@noita-explorer/noita-component-library';
import { pages } from '../../routes/pages.ts';
import { Flex } from '@noita-explorer/react-utils';

export const UnknownError = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1 style={{ lineHeight: 1.2 }}>Uhhh ohhh, something wrong happened.</h1>
      <div>You encountered a rare error! We are sorry for that :(</div>
      <br />

      {sentry.isSentryEnabled && sentry.hasSentryInitialized && (
        <div>
          <div>
            We received the error report, and we are working on resolving it.
          </div>
          <div>Thank you for enabling anonymous bug reporting :D</div>
        </div>
      )}

      {sentry.isSentryEnabled && !sentry.hasSentryInitialized && (
        <div>
          <div>Thank you for enabling anonymous bug reporting!</div>
          <br />
          <div>
            Unfortunately it looks like an ad blocker has blocked the reporting.
          </div>
          <div>
            It would be nice if you could disable any ad-blockers or trackers
            for this site, so we can receive the bug report and start working on
            it.
          </div>
          <div>
            (There are no trackers or ads on the website, only the bug reporting
            system)
          </div>
        </div>
      )}

      {!sentry.isSentryEnabled && (
        <div>
          <div>
            If you wish to help us resolve these errors faster, we kindly ask
            you to enable the anonymous bug reporting in the Settings.
          </div>
          <br />
          <Button onClick={() => navigate(pages.settings.index)}>
            Bring me to Settings
          </Button>
        </div>
      )}

      <br />
      <Flex gap={10}>
        <Button onClick={() => location.reload()}>Refresh Page</Button>
        <span>/</span>
        <Button onClick={() => navigate(pages.main)}>Go to Main Menu</Button>
      </Flex>
    </>
  );
};
