type MetaName = 'application-name' | 'description';
type MetaProperty = 'og:site_name' | 'og:title';

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
