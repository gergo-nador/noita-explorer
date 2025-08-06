import React, { useRef, useState } from 'react';
import { Flex, HoveredStyle } from '@noita-explorer/react-utils';
import { Icon, useToast } from '@noita-explorer/noita-component-library';
import { noitaAPI } from '../utils/noita-api.ts';
import { publicPaths } from '../utils/public-paths.ts';

interface Props {
  children: React.ReactNode;
  link: string;
  iconSize?: number;
}

export const CopyLinkText = ({ children, link, iconSize }: Props) => {
  const toast = useToast();
  const [icon, setIcon] = useState<'link' | 'check' | 'error'>('link');
  const timeoutRef = useRef<number>(undefined);

  const copyToClipboard = () =>
    noitaAPI.clipboard
      .set(link)
      .then(() => {
        toast.success('Link copied.');
        setIcon('check');
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIcon('link'), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy link to clipboard.');
        setIcon('error');
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIcon('link'), 2000);
      });

  return (
    <HoveredStyle style={{ textDecoration: 'underline', cursor: 'pointer' }}>
      <Flex onClick={() => copyToClipboard()} gap={8}>
        {children}
        {icon === 'link' && (
          <Icon
            src={publicPaths.static.dataWak.icons('link-icon')}
            size={iconSize ?? 20}
          />
        )}
        {icon === 'check' && <Icon type='check' size={iconSize ?? 20} />}
        {icon === 'error' && <Icon type='cross' size={iconSize ?? 20} />}
      </Flex>
    </HoveredStyle>
  );
};
