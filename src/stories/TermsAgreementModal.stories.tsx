import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { TermsAgreementModal } from '@/app/oauth/_components/TermsAgreementModal';

function TermsAgreementModalStoryShell({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    sessionStorage.setItem('mg_access_token', 'storybook-token');

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === 'string'
          ? input
          : input instanceof Request
            ? input.url
            : input instanceof URL
              ? input.href
              : String(input);

      if (url.includes('/auth/terms')) {
        return new Response(
          JSON.stringify({
            status: 0,
            code: 'SUCCESS',
            message: 'ok',
            data: null,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }

      return originalFetch(input, init);
    };

    return () => {
      globalThis.fetch = originalFetch;
      sessionStorage.removeItem('mg_access_token');
    };
  }, []);

  return <>{children}</>;
}

const meta = {
  title: 'OAuth/TermsAgreementModal',
  component: TermsAgreementModal,
  tags: ['autodocs'],
  args: {
    open: true,
    onDismiss: () => {},
    onComplete: () => {},
  },
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <TermsAgreementModalStoryShell>
        <div className="min-h-dvh bg-background-default">
          <Story />
        </div>
      </TermsAgreementModalStoryShell>
    ),
  ],
} satisfies Meta<typeof TermsAgreementModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    open: true,
    onDismiss: () => {},
    onComplete: () => {},
  },
  render: function Render() {
    const [open, setOpen] = React.useState(true);

    return (
      <div className="p-6">
        <button
          type="button"
          className="mb-4 rounded-lg border border-border-default bg-background-w px-4 py-2 body-2-bold text-strong hover:bg-gray-100"
          onClick={() => setOpen(true)}
        >
          모달 다시 열기
        </button>
        <TermsAgreementModal
          open={open}
          onDismiss={() => setOpen(false)}
          onComplete={() => setOpen(false)}
        />
      </div>
    );
  },
};
