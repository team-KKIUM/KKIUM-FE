import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ExperienceAddProgress } from '@/app/(pages)/experience/add/_components/ExperienceAddProgress';

const meta = {
  title: 'Experience/ExperienceAddProgress',
  component: ExperienceAddProgress,
  tags: ['autodocs'],
  args: {
    currentStepIndex: 0,
  },
  argTypes: {
    currentStepIndex: {
      control: { type: 'number', min: 0, max: 4 },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[1204px] bg-background-default p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExperienceAddProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
