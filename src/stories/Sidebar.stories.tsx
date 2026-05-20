import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Sidebar } from '@/components/common/Sidebar';

const meta = {
  title: 'Common/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: {
    collapsed: false,
  },
};

export const Collapsed: Story = {
  args: {
    collapsed: true,
  },
};
