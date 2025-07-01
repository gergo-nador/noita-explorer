interface Props {
  title: string;
  description: string;
  url: string;
  siteName: string;
  image: {
    url: string;
    mimeType: 'image/png';
    width: string;
    height: string;
    alt: string;
  };
  redirectUrl: string;
}

// mom can we have nextjs at home? nextjs at home:
export const generateHtml = ({
  title,
  description,
  url,
  siteName,
  image,
  redirectUrl,
}: Props) => {
  // no but for real, I just don't want to migrate the whole application
  // just so the wiki page can have some SEO

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image.url}">
    <meta property="og:image:url" content="${image.url}">
    <meta property="og:image:type" content="${image.mimeType}">
    <meta property="og:image:width" content="${image.width}">
    <meta property="og:image:height" content="${image.height}">
    <meta property="og:image:alt" content="${image.alt}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="${siteName}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image.url}">
  </head>
  <body>
    <script>window.location.replace('${redirectUrl}')</script>
  </body>
</html>`;
};
