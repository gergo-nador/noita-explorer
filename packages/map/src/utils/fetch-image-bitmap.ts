export async function fetchImageBitmap(bgImagePath: string) {
  if (!bgImagePath.startsWith('/')) {
    bgImagePath = '/' + bgImagePath;
  }

  const response = await fetch(bgImagePath);
  if (!response.ok)
    throw new Error(`Failed to load image: ${response.statusText}`);

  const blob = await response.blob();
  const img = await createImageBitmap(blob);

  return {
    img,
    close: () => img.close(),
  };
}
