import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ArrowButton } from '@/components/common/ArrowButton';

const meta = {
  title: 'Common/ArrowButton',
  component: ArrowButton,
  tags: ['autodocs'],
  args: {
    direction: 'left',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['left', 'right'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ArrowButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => (
    <div className="flex w-fit flex-col gap-4 bg-background-default p-6">
      <div className="flex items-center gap-7">
        <ArrowButton direction="left" />
        <ArrowButton direction="left" disabled />
        <ArrowButton
          direction="left"
          className="bg-gray-500 text-gray-100 shadow-sm"
          aria-label="이전 hover"
        />
      </div>

      <div className="flex items-center gap-7">
        <ArrowButton direction="right" />
        <ArrowButton direction="right" disabled />
        <ArrowButton
          direction="right"
          className="bg-gray-500 text-gray-100 shadow-sm"
          aria-label="다음 hover"
        />
      </div>
    </div>
  ),
};
