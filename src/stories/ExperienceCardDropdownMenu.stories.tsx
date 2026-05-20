import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ExperienceCardDropdownMenu } from '@/app/(pages)/experience/_components/ExperienceCardDropdownMenu';

const meta = {
  title: 'Experience/ExperienceCardDropdownMenu',
  component: ExperienceCardDropdownMenu,
  tags: ['autodocs'],
  args: {
    open: true,
  },
  argTypes: {
    open: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div className="flex h-[240px] w-[360px] items-start justify-end bg-background-default p-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExperienceCardDropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <ExperienceCardDropdownMenu {...args} />,
};
