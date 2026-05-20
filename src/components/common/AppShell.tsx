'use client';

import * as React from 'react';

import { Sidebar } from '@/components/common/Sidebar';

const SIDEBAR_WIDTH = {
  collapsed: '73px',
  expanded: '252px',
} as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed] = React.useState(false);
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded;
  const appShellStyle = {
    '--app-sidebar-width': sidebarWidth,
    '--app-content-left': sidebarWidth,
  } as React.CSSProperties;

  React.useEffect(() => {
    document.documentElement.style.setProperty('--app-sidebar-width', sidebarWidth);
    document.documentElement.style.setProperty('--app-content-left', sidebarWidth);

    return () => {
      document.documentElement.style.removeProperty('--app-sidebar-width');
      document.documentElement.style.removeProperty('--app-content-left');
    };
  }, [sidebarWidth]);

  return (
    <div
      style={appShellStyle}
      // sidebar-width와 content-left는 사이드바 오른쪽 경계를 기준으로 콘텐츠 영역을 계산합니다.
      className="min-h-dvh bg-background-default"
    >
      <Sidebar collapsed={collapsed} />
      <main className="ml-(--app-sidebar-width) min-h-dvh min-w-0 pt-[30px]">
        {children}
      </main>
    </div>
  );
}
