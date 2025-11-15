import { FileSystemDirectoryAccess } from '@noita-explorer/model';
import { createBufferReader, stringHelpers } from '@noita-explorer/tools';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';
import { DataWakMediaIndex } from '@noita-explorer/model-noita';

interface Props {
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}

export async function scrapeDataWakMediaIndex({
  dataWakParentDirectoryApi,
}: Props) {
  let dirQueue = [dataWakParentDirectoryApi];
  const imgDimensionsTemp: Record<string, DataWakMediaIndex> = {};

  while (true) {
    const currentDir = dirQueue.shift();
    if (!currentDir) break;

    // add sub dirs to the queue
    const subDirs = await currentDir.listDirectories();
    dirQueue = dirQueue.concat(subDirs);

    const files = await currentDir.listFiles();
    // check for png files
    const pngFiles = files.filter((f) => f.getName().endsWith('.png'));

    for (const pngFile of pngFiles) {
      const buffer = await pngFile.read.asBuffer();
      const bufferReader = createBufferReader(buffer);

      const path = stringHelpers.trim({
        text: pngFile.getFullPath(),
        fromStart: dataWakParentDirectoryApi.getFullPath() + '/',
      });
      try {
        const pngHeader = bufferReader.readPngHeader();
        imgDimensionsTemp[path] = {
          size: pngHeader,
          type: 'png',
          pngPath: path,
        };
      } catch {
        // do nothing
      }
    }

    // check for xml sprite files
    const xmlFiles = files.filter((f) => f.getName().endsWith('.xml'));

    for (const file of xmlFiles) {
      try {
        const xmlText = await file.read.asText();
        const parsedXml = await parseXml(xmlText);
        const xml = XmlWrapper(parsedXml);

        const sprite = xml.findNthTag('Sprite');
        if (!sprite) continue;

        let width: number | undefined = undefined;
        let height: number | undefined = undefined;

        const rectAnimation = sprite.findNthTag('RectAnimation');
        const imgFileName = sprite.getRequiredAttribute('filename').asText();

        if (rectAnimation) {
          width = rectAnimation.getAttribute('frame_width')?.asInt();
          height = rectAnimation.getAttribute('frame_height')?.asInt();
        } else {
          // if there is no RectAnimation tag in sprite, the dimensions are the same as the image
          const imgFile = await dataWakParentDirectoryApi.getFile(imgFileName);
          if (!imgFile) {
            continue;
          }

          const imgBuffer = await imgFile.read.asBuffer();
          const bufferReader = createBufferReader(imgBuffer);
          const dimensions = bufferReader.readPngHeader();

          width = dimensions.width;
          height = dimensions.height;
        }

        if (!width || !height) {
          continue;
        }

        const path = stringHelpers.trim({
          text: file.getFullPath(),
          fromStart: dataWakParentDirectoryApi.getFullPath() + '/',
        });

        imgDimensionsTemp[path] = {
          size: { width, height },
          type: rectAnimation ? 'xml-gif' : 'xml-png',
          xmlGifFirstFrame: rectAnimation && {
            position: {
              x: rectAnimation.getRequiredAttribute('pos_x').asInt(),
              y: rectAnimation.getRequiredAttribute('pos_y').asInt(),
            },
            size: { width, height },
          },
          pngPath: imgFileName,
        };
      } catch {
        // do nothing
      }
    }
  }

  return imgDimensionsTemp;
}
