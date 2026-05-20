import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  ExperienceCategoryTab,
  type ExperienceCategory,
} from '@/app/(pages)/experience/_components/ExperienceCategoryTab';

const categories: ExperienceCategory[] = ['all', 'activity', 'career', 'education', 'etc'];

const meta = {
  title: 'Experience/ExperienceCategoryTab',
  component: ExperienceCategoryTab,
  tags: ['autodocs'],
  args: {
    category: 'all',
    selected: false,
  },
  argTypes: {
    category: {
      control: 'select',
      options: categories,
    },
    selected: {
      control: 'boolean',
    },
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
} satisfies Meta<typeof ExperienceCategoryTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => (
    <div className="flex w-fit flex-col gap-5 bg-background-default p-6">
      <div className="flex items-center gap-3">
        {categories.map((category) => (
          <ExperienceCategoryTab key={category} category={category} />
        ))}
      </div>

      <div className="flex items-center gap-3">
        {categories.map((category) => (
          <ExperienceCategoryTab key={category} category={category} selected />
        ))}
      </div>
    </div>
  ),
};
