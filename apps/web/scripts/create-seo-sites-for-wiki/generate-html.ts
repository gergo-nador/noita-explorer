interface Props {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  siteName: string;
}

// mom can we have nextjs at home? nextjs at home:
export const generateHtmlHead = ({
  title,
  description,
  url,
  imageUrl,
  siteName,
}: Props) => {
  // no but for real, I just don't want to migrate the whole application
  // just so the wiki page can have some SEO

  return `
<head>
  <!-- Basic Meta -->
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${url}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${siteName}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:site" content="@mydevblog">
</head>`;
};
