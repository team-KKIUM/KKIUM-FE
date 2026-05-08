'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

import { Sidebar } from '@/components/common/Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed] = React.useState(false);
  const pathname = usePathname();
  const sidebarVariant = pathname?.startsWith('/apply') ? 'menu' : 'fullMenu';

  return (
    <>
      <Sidebar variant={sidebarVariant} collapsed={collapsed} />
      <main
        className={cn('min-h-[calc(100vh-32px)] min-w-0', collapsed ? 'ml-[73px]' : 'ml-[252px]')}
      >
        {children}
      </main>
    </>
  );
}
