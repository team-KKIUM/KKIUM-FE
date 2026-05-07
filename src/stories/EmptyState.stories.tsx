import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { EmptyState } from '@/components/common/EmptyState';

const meta = {
  title: 'Common/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: '등록된 경험이 없습니다',
    description: '경험을 추가하면 이곳에서 한눈에 확인할 수 있습니다.',
  },
  argTypes: {
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-background-default p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
