import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  ExperienceCategoryTabs,
  type ExperienceCategoryTabsProps,
} from '@/app/(pages)/experience/_components/ExperienceCategoryTabs';
import type { ExperienceCategory } from '@/app/(pages)/experience/_components/ExperienceCategoryTab';

const meta = {
  title: 'Experience/ExperienceCategoryTabs',
  component: ExperienceCategoryTabs,
  tags: ['autodocs'],
  args: {
    selectedCategory: 'all',
  },
  argTypes: {
    selectedCategory: {
      control: 'select',
      options: ['all', 'activity', 'career', 'education', 'etc'],
    },
    onCategoryChange: {
      action: 'category changed',
    },
  },
} satisfies Meta<typeof ExperienceCategoryTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Interactive: Story = {
  args: {
    selectedCategory: 'all',
  },
  render: (args: ExperienceCategoryTabsProps) => {
    const [selectedCategory, setSelectedCategory] = React.useState<ExperienceCategory>(
      args.selectedCategory,
    );

    return (
      <div className="w-fit bg-background-default p-6">
        <ExperienceCategoryTabs
          {...args}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
    );
  },
};
