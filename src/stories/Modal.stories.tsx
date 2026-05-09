import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Modal, ModalDescription, ModalTitle } from '@/components/common/Modal';

const meta = {
  title: 'Common/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    children: null,
    defaultOpen: true,
    showCloseButton: false,
  },
  argTypes: {
    showCloseButton: { control: 'boolean' },
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
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Modal {...args}>
      <div className="flex w-full flex-col gap-0.5">
        <ModalTitle>자료 추가하기</ModalTitle>
        <ModalDescription>모달 내부 내용은 페이지에서 자유롭게 구성합니다.</ModalDescription>
      </div>

      <div className="flex h-[240px] w-full items-center justify-center rounded-lg bg-gray-100 body-2-regular text-secondary">
        페이지별 콘텐츠 영역
      </div>
    </Modal>
  ),
};
