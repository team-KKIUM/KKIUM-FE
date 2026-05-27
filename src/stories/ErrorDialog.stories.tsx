import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ErrorDialog } from '@/components/common/ErrorDialog';

const meta = {
  title: 'Common/ErrorDialog',
  component: ErrorDialog,
  tags: ['autodocs'],
  args: {
    open: true,
    message: '요청한값이 부족하거나,\n올바르지 않습니다.',
    confirmLabel: '확인',
    onOpenChange: () => undefined,
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="min-h-dvh bg-background-default">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ErrorDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
