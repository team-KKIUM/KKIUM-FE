import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { ApplicationIcon } from '@/components/common/icons/ApplicationIcon';
import { ExperienceIcon } from '@/components/common/icons/ExperienceIcon';
import { HomeIcon } from '@/components/common/icons/HomeIcon';
import { SidebarMenuItem } from '@/components/common/SidebarMenuItem';

const meta = {
  title: 'Common/SidebarMenuItem',
  component: SidebarMenuItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SidebarMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '홈',
    icon: HomeIcon,
    href: '#',
    active: false,
    collapsed: false,
  },
};

export const Interactive: Story = {
  args: {
    label: '홈',
    icon: HomeIcon,
    href: '#',
  },
  render: () => <InteractiveSidebarMenuItems />,
};

function InteractiveSidebarMenuItems() {
  const [activeLabel, setActiveLabel] = useState('홈');
  const items = [
    { label: '홈', icon: HomeIcon },
    { label: '경험 관리', icon: ExperienceIcon },
    { label: '지원 관리', icon: ApplicationIcon },
  ];

  return (
    <div className="flex w-[252px] flex-col gap-2 rounded-md bg-black p-3">
      {items.map((item) => (
        <SidebarMenuItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          href="#"
          active={activeLabel === item.label}
          onClick={(event) => {
            event.preventDefault();
            setActiveLabel(item.label);
          }}
        />
      ))}
    </div>
  );
}
