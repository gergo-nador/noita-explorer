import { Head } from '../head/head';

interface Props {
  title: string;
  description: string;
}

export const SeoDefaultPage = ({ title, description }: Props) => {
  return (
    <>
      <title>{title}</title>
      <Head>
        <Head.Meta name='description' content={description} />

        {/* Open Graph */}
        <Head.Meta property='og:title' content={title} />
        <Head.Meta property='og:description' content={description} />
        <Head.Meta property='og:type' content='website' />

        {/* Twitter card */}
        <Head.Meta name='twitter:card' content='summary_large_image' />
        <Head.Meta name='twitter:title' content={title} />
        <Head.Meta name='twitter:description' content={description} />
        <Head.Meta name='twitter:image' content='/icons/icon-512.png' />
      </Head>
    </>
  );
};
