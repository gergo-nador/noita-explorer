import {
  FileSystemDirectoryAccess,
  FileSystemFileAccess,
} from '@noita-explorer/model';
import {
  parseXml,
  XmlWrapper,
  XmlWrapperType,
} from '@noita-explorer/tools/xml';
import { joinNoitaEntityTags, splitNoitaEntityTags } from './tags.ts';
import { arrayHelpers } from '@noita-explorer/tools';

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
 *
 * Merges child Entity tags as well.
 * @param file
 * @param dataWakParentDirectoryApi
 */
export const mergeXmlBaseFiles = async ({
  file,
  dataWakParentDirectoryApi,
}: Props) => {
  return await mergeXmlBaseFilesInternal({
    file: file,
    dataWakParentDirectoryApi: dataWakParentDirectoryApi,
  });
};

const mergeXmlBaseFilesInternal = async ({
  file,
  entityXmlTag,
  dataWakParentDirectoryApi,
  filePathsTraversed,
}: {
  file: FileSystemFileAccess;
  entityXmlTag?: XmlWrapperType;
  dataWakParentDirectoryApi: FileSystemDirectoryAccess;
  filePathsTraversed?: string[];
}) => {
  filePathsTraversed ??= [];

  const filePath = file
    .getFullPath()
    .substring(dataWakParentDirectoryApi.getFullPath().length);
  filePathsTraversed.push(filePath);

  if (!entityXmlTag) {
    const xmlText = await file.read.asText();
    const xmlObj = await parseXml(xmlText);
    const xmlWrapper = XmlWrapper(xmlObj);

    entityXmlTag = xmlWrapper.findNthTag('Entity');
    if (!entityXmlTag) {
      throw new Error('rootEntity is undefined');
    }
  }

  const children = entityXmlTag.getAllChildren();

  if ('Base' in children) {
    const baseTags = children['Base'];
    for (const baseTag of baseTags) {
      const fileName = baseTag.getRequiredAttribute('file').asText();
      const baseFile = await dataWakParentDirectoryApi.getFile(fileName);

      const baseFileXml = await mergeXmlBaseFilesInternal({
        file: baseFile,
        dataWakParentDirectoryApi: dataWakParentDirectoryApi,
        filePathsTraversed: filePathsTraversed,
      });

      const baseFileXmlEntity = baseFileXml.entityXml;
      const overriddenXml = overrideBaseXml({
        baseEntityTag: baseFileXmlEntity,
        baseTag: baseTag,
        mainEntityTag: entityXmlTag,
      });

      baseTag.remove();

      const baseXmlChildren = overriddenXml.getAllChildren();

      for (const [name, children] of Object.entries(baseXmlChildren)) {
        for (let i = 0; i < children.length; i++) {
          entityXmlTag.addExistingChildNode(name, children[i], i);
        }
      }
    }
  }

  if ('Entity' in children) {
    const childEntities = children['Entity'];
    for (const entity of childEntities) {
      await mergeXmlBaseFilesInternal({
        file,
        entityXmlTag: entity,
        dataWakParentDirectoryApi,
        filePathsTraversed: filePathsTraversed,
      });
    }
  }

  return {
    entityXml: entityXmlTag,
    filePathsTraversed: arrayHelpers.unique(filePathsTraversed),
  };
};

const overrideBaseXml = ({
  baseEntityTag,
  baseTag,
  mainEntityTag,
}: {
  baseEntityTag: XmlWrapperType;
  baseTag: XmlWrapperType;
  mainEntityTag: XmlWrapperType;
}): XmlWrapperType => {
  overrideXmlChildren({ xmlFrom: baseTag, xmlTo: baseEntityTag });

  // Copy Entity tags
  const baseEntityTags = baseEntityTag?.getAttribute('tags')?.asText();
  if (baseEntityTags) {
    const mainEntityTags = mainEntityTag.getAttribute('tags')?.asText();
    if (!mainEntityTags) {
      mainEntityTag.setAttribute('tags', baseEntityTags);
    } else {
      const allTags = [
        ...splitNoitaEntityTags(baseEntityTags),
        ...splitNoitaEntityTags(mainEntityTags),
      ];

      const uniqueTags = arrayHelpers.unique(allTags);
      const newTags = joinNoitaEntityTags(uniqueTags);
      mainEntityTag.setAttribute('tags', newTags);
    }
  }

  return baseEntityTag;
};

const overrideXmlChildren = ({
  xmlFrom,
  xmlTo,
}: {
  xmlFrom: XmlWrapperType;
  xmlTo: XmlWrapperType;
}) => {
  const xmlFromChildren = xmlFrom.getAllChildren();
  const xmlToChildren = xmlTo.getAllChildren();

  for (const [tagName, tags] of Object.entries(xmlFromChildren)) {
    if (!(tagName in xmlToChildren)) {
      tags.forEach((tag) => {
        tag.remove();
        xmlTo.addExistingChildNode(tagName, tag);
      });
      continue;
    }

    const baseFileXmlTags = xmlToChildren[tagName];

    // 1. Remove tags with _remove_from_base="1"
    for (let i = 0; i < tags.length && i < baseFileXmlTags.length; i++) {
      const removeFromBase = tags[i]
        .getAttribute('_remove_from_base')
        ?.asBoolean();
      if (removeFromBase) {
        tags[i].remove();
        baseFileXmlTags[i].remove();
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

      overrideXmlChildren({ xmlFrom: tagWithNewData, xmlTo: tagToBeOverriden });
    }
  }
};
