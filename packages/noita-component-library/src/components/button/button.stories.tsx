import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'noita-component-library/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'black',
      values: [
        { name: 'black', value: '#000000' },
        { name: 'white', value: '#ffffff' }, // Optional alternative
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Button
export const Primary: Story = {
  args: {
    children: 'Click Me',
    onClick: () => alert('Button Clicked!'),
  },
};

// Disabled Button
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
    onDisabledClick: () => alert('Disabled button clicked'),
  },
};

// Button with Left Decoration
export const LeftDecoration: Story = {
  args: {
    children: 'Left Decoration',
    decoration: 'left',
  },
};

// Button with Right Decoration
export const RightDecoration: Story = {
  args: {
    children: 'Right Decoration',
    decoration: 'right',
  },
};

// Button with Both Decorations
export const BothDecorations: Story = {
  args: {
    children: 'Decorated Button',
    decoration: 'both',
  },
};

// Button with No Decoration
export const NoDecoration: Story = {
  args: {
    children: 'Plain Button',
    decoration: 'none',
  },
};
