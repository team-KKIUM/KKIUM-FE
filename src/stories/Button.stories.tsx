import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Common/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: '경험 추가',
    variant: 'default',
    size: 'default',
    leftIcon: <PlusIcon />,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'fill', 'line', 'danger', 'dangerFill', 'ai'],
    },
    size: {
      control: 'select',
      options: ['default', 'medium', 'small', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-6">
      <ButtonRow title="Default">
        <Button leftIcon={<PlusIcon />}>경험 추가</Button>
        <Button className="bg-gray-800 shadow-sm" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button className="bg-background-b text-on-fill shadow-focus-ring" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button disabled leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
      </ButtonRow>

      <ButtonRow title="Secondary">
        <Button variant="secondary" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="secondary" className="bg-gray-300 shadow-sm" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button
          variant="secondary"
          className="bg-gray-200 shadow-focus-ring"
          leftIcon={<PlusIcon />}
        >
          경험 추가
        </Button>
        <Button variant="secondary" disabled leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
      </ButtonRow>

      <ButtonRow title="Sizes">
        <Button leftIcon={<PlusIcon />}>경험 추가</Button>
        <Button size="medium" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="secondary" size="small" leftIcon={<PlusIcon />}>
          추가하기
        </Button>
      </ButtonRow>

      <ButtonRow title="Size Matrix">
        <Button leftIcon={<PlusIcon />}>경험 추가</Button>
        <Button size="medium" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button size="small" leftIcon={<PlusIcon />}>
          추가하기
        </Button>
        <Button variant="secondary" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="secondary" size="medium" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="secondary" size="small" leftIcon={<PlusIcon />}>
          추가하기
        </Button>
        <Button variant="line" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="line" size="medium" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="line" size="small" leftIcon={<PlusIcon />}>
          추가하기
        </Button>
        <Button variant="fill" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="fill" size="medium" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="fill" size="small" leftIcon={<PlusIcon />}>
          추가하기
        </Button>
        <Button variant="danger" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="danger" size="medium" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="danger" size="small" leftIcon={<PlusIcon />}>
          추가하기
        </Button>
        <Button variant="dangerFill" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="dangerFill" size="medium" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="dangerFill" size="small" leftIcon={<PlusIcon />}>
          추가하기
        </Button>
      </ButtonRow>

      <ButtonRow title="Line">
        <Button variant="line" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button
          variant="line"
          className="border-border-bold bg-background-default shadow-sm"
          leftIcon={<PlusIcon />}
        >
          경험 추가
        </Button>
        <Button
          variant="line"
          className="border-border-default bg-background-w shadow-focus-ring"
          leftIcon={<PlusIcon />}
        >
          경험 추가
        </Button>
        <Button variant="line" disabled leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
      </ButtonRow>

      <ButtonRow title="Fill">
        <Button variant="fill" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="fill" className="bg-mint-100 shadow-sm" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="fill" className="bg-mint-50 shadow-focus-ring" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="fill" disabled leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
      </ButtonRow>

      <ButtonRow title="Danger">
        <Button variant="danger" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="danger" className="bg-red-50 shadow-sm" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="danger" className="bg-background-w shadow-focus-ring" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="danger" disabled leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
      </ButtonRow>

      <ButtonRow title="Danger Fill">
        <Button variant="dangerFill" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="dangerFill" className="bg-red-500 shadow-sm" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="dangerFill" className="bg-danger shadow-focus-ring" leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
        <Button variant="dangerFill" disabled leftIcon={<PlusIcon />}>
          경험 추가
        </Button>
      </ButtonRow>
    </div>
  ),
};

function ButtonRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="body-3-bold text-secondary">{title}</h3>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  );
}
