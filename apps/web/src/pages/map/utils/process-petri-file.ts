import { FileSystemFileAccess } from '@noita-explorer/model';
import { FastLZCompressor } from '@noita-explorer/fastlz';
import { uncompressNoitaFile } from '@noita-explorer/map';

export async function processPetriFile({
  petriFile,
  compressor,
}: {
  petriFile: FileSystemFileAccess;
  compressor: FastLZCompressor;
}) {
  const uncompressed = await uncompressNoitaFile(petriFile, compressor);

  const chunk = readRawChunk(uncompressed);
  return chunk;
}
