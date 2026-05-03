import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Sidebar } from '@/components/common/Sidebar';

const meta = {
  title: 'Common/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Menu: Story = {
  args: {
    variant: 'menu',
    collapsed: false,
  },
};

export const FullMenu: Story = {
  args: {
    variant: 'fullMenu',
    collapsed: false,
  },
};
