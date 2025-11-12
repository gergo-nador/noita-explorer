import { Map2dOrganizedObject } from '../noita-map.types.ts';

interface Props<T> {
  items: {
    instance: T;
    width: number;
    height: number;
    x: number;
    y: number;
  }[];
}

export function organizeFilesInto2dChunks<T>({ items }: Props<T>) {
  const storage: Map2dOrganizedObject<T[]> = {};

  for (const item of items) {
    const leftX = item.x;
    const rightX = leftX + item.width;
    const topY = item.y;
    const bottomY = topY + item.height;

    const leftXChunk = Math.floor(leftX / 512);
    const rightXChunk = Math.ceil(rightX / 512);
    const topYChunk = Math.floor(topY / 512);
    const bottomYChunk = Math.ceil(bottomY / 512);

    for (let x = leftXChunk; x < rightXChunk; x++) {
      for (let y = topYChunk; y < bottomYChunk; y++) {
        if (!(x in storage)) {
          storage[x] = {};
        }

        if (!(y in storage[x])) {
          storage[x][y] = [];
        }

        storage[x][y].push(item.instance);
      }
    }
  }

  return storage;
}
