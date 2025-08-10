import React from 'react';

interface Props {
  children: React.ReactNode;
  canonicalUrl?: string;
}

export const HtmlDoc = ({ children, canonicalUrl }: Props) => {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <link rel='icon' type='image/png' href='/favicon.png' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Noita Explorer</title>
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='Noita Explorer' />
        <meta property='application-name' content='Noita Explorer' />
        <meta
          name='description'
          content='Noita Explorer helps you unlock your lost in-game progress without mods. Unlock spells, enemies, perks, achievement pillars, crown, amulet, and so on...'
        />
        <meta
          name='keywords'
          content='noita,unlock,progress,game progress,unlock progress'
        />
        {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
        <meta
          name='google-site-verification'
          content='pC4tL9YCkPCuXtbGTraiIcDlsFQntUuwn17pNtr01Ek'
        />
        <link rel='manifest' href='/manifest.json' />
        <link
          rel='apple-touch-icon'
          sizes='256x256'
          href='/icons/icon-256.png'
        />
        {/*<meta name='robots' content='index, follow' />*/}
        <style
          dangerouslySetInnerHTML={{
            __html: 'html { background-color: #000000; }',
          }}
        />
        <link rel='stylesheet' href='/assets/index.css' />
      </head>
      <body>{children}</body>
    </html>
  );
};

const Root = ({ children }: { children?: React.ReactNode }) => {
  return <div id='root'>{children}</div>;
};

const Script = ({ tsx }: { tsx: boolean }) => {
  return tsx ? (
    <script type='module' src='/src/main.tsx' />
  ) : (
    <script type='module' src='/index.es.js' />
  );
};

HtmlDoc.Root = Root;
HtmlDoc.MainScript = Script;
