import React, { CSSProperties } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex } from '@noita-explorer/react-utils';
import {
  Button,
  ButtonDecoration,
  Icon,
  useToast,
} from '@noita-explorer/noita-component-library';

interface Props {
  to: string;
  children: React.ReactNode;
  external?: boolean;
  buttonDecoration?: ButtonDecoration;
  disabled?: boolean;
  onDisabledClick?: () => void;
  disabledToast?: string;
}

export const Link = ({
  to,
  children,
  external,
  buttonDecoration,
  disabled,
  onDisabledClick,
  disabledToast,
}: Props) => {
  const toast = useToast();

  // The <Flex> wrapper is needed for Firefox compatibility, otherwise
  // the links are misaligned
  return (
    <Flex>
      <LinkTag
        to={to}
        external={external ?? false}
        disabled={disabled ?? false}
        style={{
          color: 'white',
          textDecoration: 'none',
        }}
      >
        <Button
          decoration={buttonDecoration}
          disabled={disabled}
          onDisabledClick={() => {
            if (disabledToast) {
              toast.error(disabledToast);
            }

            onDisabledClick?.();
          }}
        >
          {children}
          {external && (
            <span style={{ marginLeft: 8 }}>
              <Icon src='/images/external/external-link.png' size={15} />
            </span>
          )}
        </Button>
      </LinkTag>
    </Flex>
  );
};

const LinkTag = ({
  children,
  style,
  to,
  external,
  disabled,
}: {
  children: React.ReactNode;
  style: CSSProperties;
  to: string;
  external: boolean;
  disabled: boolean;
}) => {
  if (external) {
    return (
      <a
        href={to}
        target='_blank'
        style={style}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
          }
        }}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink
      to={to}
      style={style}
      aria-disabled={disabled}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </RouterLink>
  );
};
