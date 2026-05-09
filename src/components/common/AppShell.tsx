'use client';

import * as React from 'react';

import { Sidebar } from '@/components/common/Sidebar';

const APP_SHELL_PADDING = '16px';
const SIDEBAR_WIDTH = {
  collapsed: '73px',
  expanded: '252px',
} as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed] = React.useState(false);
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded;
  const appContentLeft = `calc(${sidebarWidth} + ${APP_SHELL_PADDING})`;
  const appShellStyle = {
    '--app-shell-padding': APP_SHELL_PADDING,
    '--app-sidebar-width': sidebarWidth,
    '--app-content-left': appContentLeft,
  } as React.CSSProperties;

  React.useEffect(() => {
    document.documentElement.style.setProperty('--app-sidebar-width', sidebarWidth);
    document.documentElement.style.setProperty('--app-content-left', appContentLeft);

    return () => {
      document.documentElement.style.removeProperty('--app-sidebar-width');
      document.documentElement.style.removeProperty('--app-content-left');
    };
  }, [appContentLeft, sidebarWidth]);

  return (
    <div
      style={appShellStyle}
      // sidebar-width는 사이드바 자체 너비, content-left는 left-4 여백까지 포함한 콘텐츠 시작 위치
      className="min-h-full p-(--app-shell-padding)"
    >
      <Sidebar collapsed={collapsed} />
      <main className="ml-(--app-sidebar-width) min-h-[calc(100vh-(var(--app-shell-padding)*2))] min-w-0">
        {children}
      </main>
    </div>
  );
}
