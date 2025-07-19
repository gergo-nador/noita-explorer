import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import {
  parseXml,
  XmlWrapper,
  XmlWrapperType,
} from '@noita-explorer/tools/xml';
import {
  joinNoitaEntityTags,
  splitNoitaEntityTags,
} from '../../common/tags.ts';

interface Props {
  file: FileSystemFileAccess;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}

/**
 * This utility function expects the <Entity> component to be the root component.
 * It is also expected that if there is a <Base> tag, it is the direct child of the root <Entity> component.
 *
 * This utility function traverses through the <Base> tag hierarchy, and
 * assembles a single XML declaration.
 * @param file
 * @param dataWakParentDirectoryApi
 */
export const mergeXmlBaseFiles = async ({
  file,
  dataWakParentDirectoryApi,
}: Props): Promise<XmlWrapperType> => {
  return await mergeXmlBaseFilesInternal({
    file: file,
    dataWakParentDirectoryApi: dataWakParentDirectoryApi,
  });
};

const mergeXmlBaseFilesInternal = async ({
  file,
  dataWakParentDirectoryApi,
}: {
  file: FileSystemFileAccess;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
}): Promise<XmlWrapperType> => {
  const xmlText = await file.read.asText();
  const xmlObj = await parseXml(xmlText);
  const xmlWrapper = XmlWrapper(xmlObj);

  const rootEntity = xmlWrapper.findNthTag('Entity');
  if (!rootEntity) {
    throw new Error('rootEntity is undefined');
  }

  const children = rootEntity.getAllChildren();

  if ('Base' in children) {
    const baseTags = children['Base'];
    for (const baseTag of baseTags) {
      const fileName = baseTag.getRequiredAttribute('file').asText();
      const baseFile = await dataWakParentDirectoryApi.getFile(fileName);

      const baseFileXml = await mergeXmlBaseFilesInternal({
        file: baseFile,
        dataWakParentDirectoryApi: dataWakParentDirectoryApi,
      });

      const baseXml = overrideBaseXml({
        baseFileXml: baseFileXml,
        baseTag: baseTag,
        mainEntityTag: rootEntity,
      });

      baseTag.remove();

      const baseXmlEntity = baseXml.findNthTag('Entity');
      if (!baseXmlEntity) continue;

      const baseXmlChildren = baseXmlEntity.getAllChildren();

      for (const [name, children] of Object.entries(baseXmlChildren)) {
        for (let i = 0; i < children.length; i++) {
          rootEntity.addExistingChildNode(name, children[i], i);
        }
      }
    }
  }

  return xmlWrapper;
};

const overrideBaseXml = ({
  baseFileXml,
  baseTag,
  mainEntityTag,
}: {
  baseFileXml: XmlWrapperType;
  baseTag: XmlWrapperType;
  mainEntityTag: XmlWrapperType;
}): XmlWrapperType => {
  const baseTagChildren = baseTag.getAllChildren();
  const baseFileXmlEntity = baseFileXml.findNthTag('Entity');
  if (!baseFileXmlEntity) {
    throw new Error(`Base file does not contain Entity tag`);
  }

  const baseFileXmlChildren = baseFileXmlEntity.getAllChildren();

  for (const [tagName, tags] of Object.entries(baseTagChildren)) {
    if (!(tagName in baseFileXmlChildren)) {
      // the tag should be in the baseXmlChildren
      // maybe then we should add the tags as children to baseFileXmlChildren
      continue;
    }

    const baseFileXmlTags = baseFileXmlChildren[tagName];

    // 1. Remove tags with _remove_from_base="1"
    for (let i = 0; i < tags.length && i < baseFileXmlTags.length; i++) {
      const removeFromBase = tags[i]
        .getAttribute('_remove_from_base')
        ?.asBoolean();
      if (removeFromBase) {
        tags[i].remove();
        baseFileXmlTags[i].remove();
        i--;
      }
    }

    // 2. Override tags in base file with the tags being in the base element
    for (let i = 0; i < tags.length && i < baseFileXmlTags.length; i++) {
      const tagWithNewData = tags[i];
      const tagToBeOverriden = baseFileXmlTags[i];

      const attributes = tagWithNewData.getAllAttributes();

      for (const [key, value] of Object.entries(attributes)) {
        tagToBeOverriden.setAttribute(key, value);
      }
    }

    // 3. Copy Entity tags
    const baseEntityTags = baseFileXmlEntity?.getAttribute('tags')?.asText();
    if (baseEntityTags) {
      const mainEntityTags = mainEntityTag.getAttribute('tags')?.asText();
      if (!mainEntityTags) {
        mainEntityTag.setAttribute('tags', baseEntityTags);
      } else {
        const allTags = [
          ...splitNoitaEntityTags(baseEntityTags),
          ...splitNoitaEntityTags(mainEntityTags),
        ];

        const uniqueTags = [...new Set(allTags)];
        const newTags = joinNoitaEntityTags(uniqueTags);
        mainEntityTag.setAttribute('tags', newTags);
      }
    }
  }

  return baseFileXml;
};
