import React from 'react';
import { Flex, HoveredStyle } from '@noita-explorer/react-utils';
import linkIcon from '../assets/icons/link-icon.png';
import { Icon, useToast } from '@noita-explorer/noita-component-library';
import { noitaAPI } from '../noita-api.ts';

interface Props {
  children: React.ReactNode;
  link: string;
}

export const CopyLinkText = ({ children, link }: Props) => {
  const toast = useToast();
  const copyToClipboard = () =>
    noitaAPI.clipboard
      .set(link)
      .then(() => toast.success('Link copied.'))
      .catch(() => toast.error('Failed to copy link to clipboard.'));
  return (
    <HoveredStyle style={{ textDecoration: 'underline', cursor: 'pointer' }}>
      <Flex onClick={() => copyToClipboard()} gap={8}>
        {children}
        <Icon src={linkIcon} size={20} />
      </Flex>
    </HoveredStyle>
  );
};
