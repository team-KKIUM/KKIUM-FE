import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Container } from '@/components/common/Container';

const meta = {
  title: 'Common/Container',
  component: Container,
  tags: ['autodocs'],
  args: {
    children: '빠르게 변화하는 비즈니스 요구사항으로 인해 코드 복잡도 급증',
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
