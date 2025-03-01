import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './card';

const meta = {
  title: 'noita-component-library/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Card (Basic Usage)
export const Primary: Story = {
  args: {
    children: 'This is a basic card',
  },
};

// Gray Card
export const GrayCard: Story = {
  args: {
    children: 'This is a gray card',
    color: 'gray',
  },
};

// Gold Card
export const GoldCard: Story = {
  args: {
    children: 'This is a gold card',
    color: 'gold',
  },
};

// Card with Custom Background and Border
export const CustomStyledCard: Story = {
  args: {
    children: 'This card has a custom background and border',
    styling: {
      background: '#222',
      borderBright: '#FFD700',
      borderDark: '#B8860B',
    },
  },
};

// Card with Custom Content Styling
export const CustomContentStyleCard: Story = {
  args: {
    children: 'Styled content inside the card',
    styleContent: {
      color: '#ff6347', // Tomato red text
      fontSize: '18px',
      fontWeight: 'bold',
    },
  },
};

// Card with Multiple Children Elements
export const ComplexContentCard: Story = {
  args: {
    children: (
      <>
        <h3>Card Title</h3>
        <p>This is some descriptive text inside the card.</p>
        <button style={{ padding: '5px 10px' }}>Click Me</button>
      </>
    ),
  },
};
