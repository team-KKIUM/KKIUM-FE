import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TagSet } from '@/app/(pages)/experience/_components/TagSet';

const meta = {
  title: 'Experience/TagSet',
  component: TagSet,
  tags: ['autodocs'],
  args: {
    label: '기술',
    tone: 'skill',
    className: 'w-[452px]',
    tags: ['Figma', 'FigJam', 'Prototype', 'User Test'],
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['skill', 'competency'],
    },
  },
} satisfies Meta<typeof TagSet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-10 bg-background-default p-6">
      <div className="flex gap-20">
        <TagSet label="기술" tone="skill" className="w-[452px]" tags={['Figma', 'FigJam', 'Prototype', 'User Test']} />
        <TagSet label="역량" tone="competency" className="w-[452px]" tags={['추진력', '문제 해결', '협업', '유연성']} />
      </div>
      <TagSet label="기술" tone="skill" className="w-[950px]" tags={['Figma', 'FigJam', 'Prototype', 'User Test']} />
      <TagSet label="역량" tone="competency" className="w-[950px]" tags={['추진력', '문제 해결', '협업', '유연성']} />
    </div>
  ),
};
