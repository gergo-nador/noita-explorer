import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
  Vector2d,
} from '@noita-explorer/model';
import { createBufferReader, stringHelpers } from '@noita-explorer/tools';
import { DataWakMediaIndex } from '@noita-explorer/model-noita';
import { parseXml, XmlWrapper } from '@noita-explorer/tools/xml';

interface Props {
  file: FileSystemFileAccess;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}

export async function scrapeMediaPath({
  file,
  dataWakParentDirectoryApi,
}: Props): Promise<DataWakMediaIndex | undefined> {
  const fileName = file.getName();
  if (fileName.endsWith('.png')) {
    const pngFile = file;
    const buffer = await pngFile.read.asBuffer();
    const bufferReader = createBufferReader(buffer);

    const path = stringHelpers.trim({
      text: pngFile.getFullPath(),
      fromStart: dataWakParentDirectoryApi.getFullPath() + '/',
    });
    try {
      const pngHeader = bufferReader.readPngHeader();
      const mediaIndex: DataWakMediaIndex = {
        size: pngHeader,
        type: 'png',
        pngPath: path,
      };

      return mediaIndex;
    } catch {
      // do nothing
      return;
    }
  }

  if (fileName.endsWith('.xml')) {
    try {
      const xmlFile = file;
      const xmlText = await xmlFile.read.asText();
      const parsedXml = await parseXml(xmlText);
      const xml = XmlWrapper(parsedXml);

      const sprite = xml.findNthTag('Sprite');
      if (!sprite) return;

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
          return;
        }

        const imgBuffer = await imgFile.read.asBuffer();
        const bufferReader = createBufferReader(imgBuffer);
        const dimensions = bufferReader.readPngHeader();

        width = dimensions.width;
        height = dimensions.height;
      }

      if (!width || !height) {
        return;
      }

      const offset: Vector2d = {
        x: sprite.getAttribute('offset_x')?.asInt() ?? 0,
        y: sprite.getAttribute('offset_y')?.asInt() ?? 0,
      };

      const mediaIndex: DataWakMediaIndex = {
        size: { width, height },
        type: rectAnimation ? 'xml-gif' : 'xml-png',
        xmlGifFirstFrame: rectAnimation && {
          position: {
            x: rectAnimation.getRequiredAttribute('pos_x').asFloat(),
            y: rectAnimation.getRequiredAttribute('pos_y').asFloat(),
          },
          size: { width, height },
        },
        offset: offset,
        pngPath: imgFileName,
      };
      return mediaIndex;
    } catch {
      return;
    }
  }
}
