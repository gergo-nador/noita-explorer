import { arrayHelpers, BufferReader } from '@noita-explorer/tools';
import { readBufferString } from '../../../../utils/buffer-reader-utils/read-buffer-string.ts';
import { readBufferArray } from '../../../../utils/buffer-reader-utils/read-buffer-array.ts';
import { NoitaEntitySchemaComponentVariable } from '@noita-explorer/model-noita';
import { entityObjectMap } from './entity-object-map.ts';

interface Props {
  bufferReader: BufferReader;
  variable: NoitaEntitySchemaComponentVariable;
}

export function scrapeEntityComponentVariable({
  bufferReader,
  variable,
}: Props) {
  const type = variable.type;
  return resolveType({ bufferReader, type });
}

const CPPTypes = {
  STRING:
    'class std::basic_string<char,struct std::char_traits<char>,class std::allocator<char> >',
  VECTOR: 'class std::vector',
  VECTOR_2D: 'class ceng::math::CVector2',
  CX_FORM: 'struct ceng::math::CXForm',
};

function resolveType({
  bufferReader,
  type,
}: {
  bufferReader: BufferReader;
  type: string;
}): unknown {
  // bool
  if (type === 'bool') return bufferReader.readBool();
  // floating point
  if (type === 'float') return bufferReader.readFloatBE();
  if (type === 'double') return bufferReader.readDoubleBE();
  // int 16
  if (type === 'unsigned short') return bufferReader.readUint16BE();
  // int 32
  if (type === 'int') return bufferReader.readInt32BE();
  if (type === 'int32') return bufferReader.readInt32BE();
  if (type === 'uint32') return bufferReader.readUInt32BE();
  if (type === 'unsigned int') return bufferReader.readUInt32BE();
  // int 64
  if (type === '__int64') return bufferReader.readInt64BE();
  if (type === 'unsigned __int64') return bufferReader.readUInt64BE();
  // string
  if (type === 'string') return readBufferString(bufferReader);
  if (type === CPPTypes.STRING) return readBufferString(bufferReader);
  // enum
  if (type.startsWith('enum')) return bufferReader.readInt32BE();

  // uint array
  if (type === 'UintArrayInline' || type === 'struct UintArrayInline') {
    return readBufferArray(bufferReader).iterate((bufferReader) =>
      bufferReader.readInt32BE(),
    );
  }
  if (type === 'struct SpriteStains *') {
    //bufferReader.jumpBytes(4);
    return undefined;
  }
  if (type === 'special texture') {
    const isSpecial = bufferReader.readBool();
    if (!isSpecial) {
      return { special: false, data: [] };
    }

    const width = bufferReader.readInt32BE();
    const height = bufferReader.readInt32BE();

    const data = readBufferArray(bufferReader, {
      length: width * height,
    }).iterate((bufferReader) => bufferReader.readUInt32BE());

    return { special: true, data: data, width, height };
  }

  // composite types
  const extractedType = extractOuterAngleType(type);
  if (extractedType !== undefined) {
    const compositeValue = resolveCompositeTypes({
      bufferReader,
      innerType: extractedType.innerType,
      outerType: extractedType.outerType,
    });

    if (compositeValue) return compositeValue;
  }

  if (type in entityObjectMap) {
    const fields = entityObjectMap[type];
    const resolvedFields = fields.map((field): [string, unknown] => [
      field[0],
      resolveType({ bufferReader, type: field[1] }),
    ]);

    return arrayHelpers.asDict(
      resolvedFields,
      (field: [string, unknown]) => field[0],
    );
  }

  throw new Error(`Unknow Entity Component Variable Type: ${type}`);
}

function resolveCompositeTypes({
  outerType,
  innerType,
  bufferReader,
}: {
  outerType: string;
  innerType: string;
  bufferReader: BufferReader;
}): unknown {
  if (outerType === 'struct LensValue') {
    const value = resolveType({ bufferReader, type: innerType });
    const defaultValue = resolveType({ bufferReader, type: innerType });
    const frame = resolveType({ bufferReader, type: 'int' });

    return { value, defaultValue, frame };
  }
  if (outerType === CPPTypes.VECTOR_2D) {
    const x = resolveType({ bufferReader, type: innerType });
    const y = resolveType({ bufferReader, type: innerType });

    return { x, y };
  }
  if (outerType === CPPTypes.VECTOR) {
    const vectorContentType = innerType.split(',')[0].trim();
    return readBufferArray(bufferReader).iterate((bufferReader) =>
      resolveType({ bufferReader, type: vectorContentType }),
    );
  }
  if (outerType === CPPTypes.CX_FORM) {
    const posX = resolveType({ bufferReader, type: innerType });
    const posY = resolveType({ bufferReader, type: innerType });
    const scaleX = resolveType({ bufferReader, type: innerType });
    const scaleY = resolveType({ bufferReader, type: innerType });
    const rotation = resolveType({ bufferReader, type: innerType });

    return {
      position: { x: posX, y: posY },
      scale: { x: scaleX, y: scaleY },
      rotation,
    };
  }
}

function extractOuterAngleType(input: string) {
  const start = input.indexOf('<');
  if (start === -1) return undefined;

  const end = input.lastIndexOf('>');
  if (end === -1) return undefined;

  if (start > end) return undefined;

  return {
    outerType: input.substring(0, start).trim(),
    innerType: input.substring(start + 1, end).trim(),
  };
}
