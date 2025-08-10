type Props = DefaultProps | OGProps | TwitterProps;

export const HeadMeta = (props: Props) => {
  if ('name' in props) {
    return <meta name={props.name} content={props.content} lang='en' />;
  }

  return (
    <meta
      property={props.property}
      content={props.content.toString()}
      lang='en'
    />
  );
};

type DefaultProps =
  | { name: 'application-name'; content: string }
  | { name: 'description'; content: string }
  | { name: 'keywords'; content: string }
  | {
      name: 'referrer';
      content: 'no-referrer' | 'origin' | 'unsafe-url' | (string & {});
    };

// Open Graph types
type OGProps =
  | { property: 'og:title'; content: string }
  | { property: 'og:description'; content: string }
  | { property: 'og:image'; content: string }
  | { property: 'og:image:url'; content: string }
  | { property: 'og:image:type'; content: string }
  | { property: 'og:image:width'; content: number | string }
  | { property: 'og:image:height'; content: number | string }
  | { property: 'og:image:alt'; content: string }
  | { property: 'og:url'; content: string }
  | { property: 'og:type'; content: 'article' | 'website' | string }
  | { property: 'og:site_name'; content: string };

// Twitter types
type TwitterProps =
  | { name: 'twitter:card'; content: 'summary_large_image' }
  | { name: 'twitter:title'; content: string }
  | { name: 'twitter:description'; content: string }
  | { name: 'twitter:image'; content: string };
