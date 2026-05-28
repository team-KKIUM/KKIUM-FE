'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
  getAccessTokenFromSession,
  isAuthExemptPath,
  isPublicAuthPath,
} from '@/app/_utils/authFetch';
import { Sidebar } from '@/components/common/Sidebar';

const SIDEBAR_WIDTH = {
  collapsed: '73px',
  expanded: '252px',
} as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed] = React.useState(false);
  const [canRender, setCanRender] = React.useState(false);

  const hideSidebar = isPublicAuthPath(pathname);
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded;
  const appShellStyle = {
    '--app-sidebar-width': hideSidebar ? '0px' : sidebarWidth,
    '--app-content-left': hideSidebar ? '0px' : sidebarWidth,
  } as React.CSSProperties;

  React.useEffect(() => {
    if (isAuthExemptPath(pathname)) {
      setCanRender(true);
      return;
    }

    if (!getAccessTokenFromSession()) {
      setCanRender(false);
      router.replace('/login');
      return;
    }

    setCanRender(true);
  }, [pathname, router]);

  React.useEffect(() => {
    const width = hideSidebar ? '0px' : sidebarWidth;
    document.documentElement.style.setProperty('--app-sidebar-width', width);
    document.documentElement.style.setProperty('--app-content-left', width);

    return () => {
      document.documentElement.style.removeProperty('--app-sidebar-width');
      document.documentElement.style.removeProperty('--app-content-left');
    };
  }, [hideSidebar, sidebarWidth]);

  if (!canRender) {
    return null;
  }

  return (
    <div
      style={appShellStyle}
      // sidebar-width와 content-left는 사이드바 오른쪽 경계를 기준으로 콘텐츠 영역을 계산합니다.
      className="min-h-dvh bg-background-default"
    >
      {!hideSidebar && <Sidebar collapsed={collapsed} />}
      <main className={`ml-(--app-sidebar-width) min-h-dvh min-w-0 ${hideSidebar ? 'pt-0' : 'pt-[30px]'}`}>
        {children}
      </main>
    </div>
  );
}
