import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TextField } from '@/components/common/TextField';

const meta = {
  title: 'Common/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    variant: 'input',
    placeholder: 'Placeholder',
    helpText: 'HelpText',
    description: true,
    error: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['input', 'textarea', 'date'],
    },
    error: {
      control: 'boolean',
    },
    description: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const StateMatrix: Story = {
  render: () => (
    <div className="grid w-fit grid-cols-3 gap-x-24 gap-y-16 bg-background-default p-6">
      <TextField placeholder="Placeholder" helpText="HelpText" />
      <TextField variant="textarea" placeholder="Placeholder" helpText="HelpText" />
      <TextField variant="textarea" defaultValue="Text" helpText="HelpText" />

      <TextField
        placeholder="Placeholder"
        helpText="HelpText"
        className="border-mint-main bg-mint-50/40"
      />
      <TextField
        variant="textarea"
        placeholder="Placeholder"
        helpText="HelpText"
        className="border-mint-main bg-mint-50/40"
      />
      <TextField variant="textarea" disabled placeholder="Placeholder" helpText="HelpText" />

      <TextField
        defaultValue="Text"
        helpText="HelpText"
        className="border-mint-main bg-mint-50/40"
      />
      <TextField
        variant="textarea"
        defaultValue="Text"
        helpText="HelpText"
        className="border-mint-main bg-mint-50/40"
      />
      <TextField variant="date" />

      <TextField defaultValue="Text" helpText="HelpText" />
      <TextField variant="textarea" defaultValue="Text" helpText="HelpText" />
      <div />

      <TextField disabled placeholder="Placeholder" helpText="HelpText" />
      <TextField variant="textarea" disabled placeholder="Placeholder" helpText="HelpText" />
      <div />

      <TextField error placeholder="Placeholder" helpText="HelpText" />
      <TextField error variant="textarea" placeholder="Placeholder" helpText="HelpText" />
      <TextField error variant="textarea" defaultValue="Text" helpText="HelpText" />

      <TextField
        error
        placeholder="Placeholder"
        helpText="HelpText"
        className="border-red-700 bg-red-50/40"
      />
      <TextField
        error
        variant="textarea"
        placeholder="Placeholder"
        helpText="HelpText"
        className="border-red-700 bg-red-50/40"
      />
      <TextField error variant="textarea" disabled placeholder="Placeholder" helpText="HelpText" />

      <TextField
        error
        defaultValue="Text"
        helpText="HelpText"
        className="border-red-700 bg-red-50/40"
      />
      <TextField
        error
        variant="textarea"
        defaultValue="Text"
        helpText="HelpText"
        className="border-red-700 bg-red-50/40"
      />
      <div />

      <TextField error defaultValue="Text" helpText="HelpText" />
      <TextField error variant="textarea" defaultValue="Text" helpText="HelpText" />
    </div>
  ),
};
