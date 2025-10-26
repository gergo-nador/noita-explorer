import { FileSystemFileAccess } from '@noita-explorer/model';
import { FastLZCompressor } from '@noita-explorer/fastlz';
import { scrape } from '@noita-explorer/scrapers';

export async function processPetriFile({
  petriFile,
  compressor,
}: {
  petriFile: FileSystemFileAccess;
  compressor: FastLZCompressor;
}) {
  const petriContent = await scrape.save00.pngPetriFile({
    pngPetriFile: petriFile,
    fastLzCompressor: compressor,
  });
  return petriContent;
}
