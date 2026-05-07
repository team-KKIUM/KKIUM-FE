'use client';

import * as React from 'react';

import { Sidebar } from '@/components/common/Sidebar';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed] = React.useState(false);

  return (
    <>
      <Sidebar collapsed={collapsed} />
      <main
        className={cn('min-h-[calc(100vh-32px)] min-w-0', collapsed ? 'ml-[73px]' : 'ml-[252px]')}
      >
        {children}
      </main>
    </>
  );
}
