import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tag } from '@/components/common/Tag';

const meta = {
  title: 'Common/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: {
    children: '기술',
    tone: 'skill',
    size: 'default',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['skill', 'competency', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['default', 'large'],
    },
    addable: {
      control: 'boolean',
    },
    removable: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => (
    <div className="flex w-fit flex-col gap-4 bg-background-default p-6">
      <div className="flex items-center gap-2">
        <Tag tone="skill">기술</Tag>
        <Tag tone="competency">역량</Tag>
      </div>

      <div className="flex items-center gap-2">
        <Tag tone="skill" size="large">
          기술
        </Tag>
        <Tag tone="competency" size="large">
          역량
        </Tag>
      </div>

      <div className="flex items-center gap-3">
        <Tag tone="skill" size="large" removable>
          기술
        </Tag>
        <Tag tone="competency" size="large" removable>
          역량
        </Tag>
      </div>

      <div className="flex items-center gap-2">
        <Tag addable>기술</Tag>
      </div>

      <div className="flex items-center gap-6">
        <Tag disabled>기술</Tag>
        <Tag disabled size="large">
          기술
        </Tag>
      </div>
    </div>
  ),
};
