import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ExperienceCard } from '@/app/experience/_components/ExperienceCard';

const meta = {
  title: 'Experience/ExperienceCard',
  component: ExperienceCard,
  tags: ['autodocs'],
  args: {
    type: 'etc',
    title: '고가용성 결제 시스템 설계 및 운영',
    period: '2026.04.01~04.28',
    skillTags: ['기술', '기술', '기술', '기술'],
    competencyTags: ['역량', '역량', '역량', '역량'],
    size: 'small',
    selected: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['activity', 'career', 'education', 'etc'],
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
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
} satisfies Meta<typeof ExperienceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => (
    <div className="flex w-fit flex-col gap-6 bg-background-default p-6">
      <div className="flex flex-wrap gap-4">
        <ExperienceCard
          type="activity"
          title="고가용성 결제 시스템 설계 및 운영"
          period="2026.04.01~04.28"
          skillTags={['기술', '기술']}
          competencyTags={['역량', '역량']}
          size="small"
        />
        <ExperienceCard
          type="career"
          title="고가용성 결제 시스템 설계 및 운영"
          period="2026.04.01~04.28"
          skillTags={['기술', '기술']}
          competencyTags={['역량', '역량']}
          size="small"
          className="shadow-lg"
        />
        <ExperienceCard
          type="education"
          title="고가용성 결제 시스템 설계 및 운영"
          period="2026.04.01~04.28"
          skillTags={['기술', '기술']}
          competencyTags={['역량', '역량']}
          size="small"
          selected
        />
      </div>

      <ExperienceCard
        type="etc"
        title="고가용성 결제 시스템 설계 및 운영"
        period="2026.04.01~04.28"
        skillTags={['기술', '기술', '기술']}
        competencyTags={['역량', '역량', '역량']}
        size="default"
      />

      <ExperienceCard
        type="etc"
        title="고가용성 결제 시스템 설계 및 운영"
        period="2026.04.01~04.28"
        skillTags={['기술', '기술', '기술', '기술']}
        competencyTags={['역량', '역량', '역량', '역량']}
        size="large"
      />
    </div>
  ),
};
