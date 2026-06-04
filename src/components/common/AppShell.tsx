'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
  hasApiAccessToken,
  isPublicAuthPath,
} from '@/app/_utils/authFetch';
import { Sidebar } from '@/components/common/Sidebar';

const SIDEBAR_WIDTH = {
  collapsed: '73px',
  expanded: '252px',
} as const;

function resolveShellPathname(routerPathname: string) {
  if (typeof window === 'undefined') {
    return routerPathname;
  }

  const locationPathname = window.location.pathname;
  if (isPublicAuthPath(locationPathname)) {
    return locationPathname;
  }

  return routerPathname;
}

function getInitialCanRender(pathname: string) {
  if (typeof window === 'undefined') {
    return false;
  }

  if (isPublicAuthPath(pathname)) {
    return true;
  }

  return hasApiAccessToken();
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const routerPathname = usePathname();
  const pathname = resolveShellPathname(routerPathname);
  const router = useRouter();
  const [collapsed] = React.useState(false);
  const [canRender, setCanRender] = React.useState(() =>
    getInitialCanRender(resolveShellPathname(routerPathname)),
  );

  const hideSidebar = isPublicAuthPath(pathname);
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded;
  const appShellStyle = {
    '--app-sidebar-width': hideSidebar ? '0px' : sidebarWidth,
    '--app-content-left': hideSidebar ? '0px' : sidebarWidth,
  } as React.CSSProperties;

  React.useEffect(() => {
    const currentPath = resolveShellPathname(routerPathname);

    if (isPublicAuthPath(currentPath)) {
      setCanRender(true);
      return;
    }

    if (hasApiAccessToken()) {
      setCanRender(true);
      return;
    }

    setCanRender(false);
    router.replace('/login');
  }, [routerPathname, router]);

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
      className="min-h-dvh bg-background-default"
    >
      {!hideSidebar && <Sidebar collapsed={collapsed} />}
      <main className={`ml-(--app-sidebar-width) min-h-dvh min-w-0 ${hideSidebar ? 'pt-0' : 'pt-[30px]'}`}>
        <div className={hideSidebar ? undefined : 'mx-20'}>{children}</div>
      </main>
    </div>
  );
}
