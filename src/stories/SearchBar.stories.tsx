import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SearchBar } from '@/components/common/SearchBar';

const meta = {
  title: 'Common/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  args: {
    placeholder: '경험을 검색해주세요',
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => (
    <div className="flex w-fit flex-col gap-7 bg-background-default p-6">
      <SearchBar placeholder="경험을 검색해주세요" />
      <SearchBar placeholder="검색" />
      <SearchBar value="타이핑중" onChange={() => {}} />
    </div>
  ),
};
