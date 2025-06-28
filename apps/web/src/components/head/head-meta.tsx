type MetaName = 'application-name' | 'description' | 'keywords' | 'referrer';
type MetaProperty = 'og:site_name' | 'og:title' | 'og:type';

export const HeadMeta = ({
  name,
  property,
  content,
}: {
  name?: MetaName;
  property?: MetaProperty;
  content: string;
}) => {
  return <meta name={name} property={property} content={content} lang='en' />;
};
