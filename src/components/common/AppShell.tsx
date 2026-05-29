'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { getAccessTokenFromSession, isPublicAuthPath } from '@/app/_utils/authFetch';
import { Sidebar } from '@/components/common/Sidebar';

const SIDEBAR_WIDTH = {
  collapsed: '73px',
  expanded: '252px',
} as const;
const MOBILE_LANDING_MEDIA_QUERY = '(max-width: 767px)';

function isRootPath(pathname: string) {
  return (pathname.replace(/\/$/, '') || '/') === '/';
}

function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_LANDING_MEDIA_QUERY).matches;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed] = React.useState(false);
  const [canRender, setCanRender] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const isRoot = isRootPath(pathname);
  const hideSidebar = isPublicAuthPath(pathname) || (isRoot && !isAuthenticated);
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded;
  const appShellStyle = {
    '--app-sidebar-width': hideSidebar ? '0px' : sidebarWidth,
    '--app-content-left': hideSidebar ? '0px' : sidebarWidth,
  } as React.CSSProperties;

  React.useEffect(() => {
    if (isPublicAuthPath(pathname)) {
      setIsAuthenticated(false);
      setCanRender(true);
      return;
    }

    const hasAccessToken = Boolean(getAccessTokenFromSession());

    setIsAuthenticated(hasAccessToken);

    if (hasAccessToken) {
      setCanRender(true);
      return;
    }

    if (isRootPath(pathname) && isMobileViewport()) {
      setCanRender(true);
      return;
    }

    if (!hasAccessToken) {
      setCanRender(false);
      router.replace('/login');
      return;
    }
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
        <div className={hideSidebar ? undefined : 'mx-20'}>{children}</div>
      </main>
    </div>
  );
}
