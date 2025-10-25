import { BufferReader } from '@noita-explorer/tools';

export const scrapePhysicsObject = ({
  bufferReader,
}: {
  bufferReader: BufferReader;
}) => {
  bufferReader.jumpBytes(12);
  // ulong id
  // uint material
  const posX = bufferReader.readFloatBE();
  const posY = bufferReader.readFloatBE();
  const rotation = bufferReader.readFloatBE();
  bufferReader.jumpBytes(49);
  // 5 unknown long: 40 bytes
  // 5 unknown bools: 5 bytes
  // 1 unknown float: 4 bytes
  const width = bufferReader.readUInt32BE();
  const height = bufferReader.readUInt32BE();

  const pixelData = readBufferArray(bufferReader, {
    length: width * height,
  }).iterate((bufferReader) => bufferReader.readUInt32BE());

  const physicsObject = {
    position: { x: posX, y: posY },
    rotation: rotation,
    width: width,
    height: height,

    pixelData: pixelData.items,
  } satisfies ChunkPhysicsObject;

  return physicsObject;
};
