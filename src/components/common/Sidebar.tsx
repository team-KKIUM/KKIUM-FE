'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { clearAccessTokenFromSession } from '@/app/_utils/authFetch';
import { AccountDialog } from '@/components/common/AccountDialog';
import { ApplicationIcon } from '@/components/common/icons/ApplicationIcon';
import { ExperienceIcon } from '@/components/common/icons/ExperienceIcon';
import { HomeIcon } from '@/components/common/icons/HomeIcon';
import { LogoutIcon } from '@/components/common/icons/LogoutIcon';
import { SettingsIcon } from '@/components/common/icons/SettingsIcon';
import { SidebarMenuItem, type SidebarMenuItemIcon } from '@/components/common/SidebarMenuItem';
import { SidebarProfile } from '@/components/common/SidebarProfile';
import { cn } from '@/lib/utils';

export type SidebarItem = {
  label: string;
  icon: SidebarMenuItemIcon;
  href: string;
};

export interface SidebarProps {
  collapsed?: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    label: '홈',
    icon: HomeIcon,
    href: '/',
  },
  {
    label: '경험 관리',
    icon: ExperienceIcon,
    href: '/experience',
  },
  {
    label: '지원 관리',
    icon: ApplicationIcon,
    href: '/apply/list',
  },
];

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const profileMenuId = React.useId();
  const profileMenuRef = React.useRef<HTMLDivElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = React.useState(false);
  const logoSrc = collapsed ? '/logo-light-mark.svg' : '/logo-light.svg';
  const logoSize = collapsed ? { width: 49, height: 49 } : { width: 136, height: 49 };

  React.useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (profileMenuRef.current?.contains(event.target as Node)) return;

      setIsProfileMenuOpen(false);
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isProfileMenuOpen]);

  const handleProfileClick = () => {
    setIsProfileMenuOpen((open) => !open);
  };

  const handleAccountClick = () => {
    setIsProfileMenuOpen(false);
    setIsAccountDialogOpen(true);
  };

  const handleLogoutClick = () => {
    clearAccessTokenFromSession();
    setIsProfileMenuOpen(false);
    router.replace('/login');
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 flex h-dvh flex-col justify-between overflow-x-hidden overflow-y-auto border-r border-border-default bg-background-w py-[26px]',
        collapsed ? 'w-[73px] px-3' : 'w-[252px] px-6',
      )}
    >
      <div className="flex flex-col gap-5">
        <Link
          href="/"
          aria-label="홈으로 이동"
          className="w-fit rounded-sm focus-visible:shadow-focus-ring focus-visible:outline-none"
        >
          <Image
            src={logoSrc}
            alt="KKIUM"
            width={logoSize.width}
            height={logoSize.height}
            priority
            className={cn(collapsed ? 'size-[49px]' : 'h-[49px] w-[136px]')}
          />
        </Link>

        <nav aria-label="주요 메뉴" className="flex flex-col gap-2.5">
          {sidebarItems.map((item) => (
            <SidebarNavItem
              key={item.label}
              item={item}
              collapsed={collapsed}
              active={isSidebarItemActive(item, pathname)}
            />
          ))}
        </nav>
      </div>

      <div ref={profileMenuRef} className="relative">
        {isProfileMenuOpen && (
          <div
            id={profileMenuId}
            className={cn(
              'absolute bottom-16 z-50 flex w-[234px] flex-col gap-2 rounded-2xl bg-background-default p-2.5 shadow-md',
              collapsed ? 'left-0' : 'left-1/2 -translate-x-1/2',
            )}
          >
            <SidebarProfileMenuItem label="계정" icon={SettingsIcon} onClick={handleAccountClick} />
            <SidebarProfileMenuItem label="로그아웃" icon={LogoutIcon} onClick={handleLogoutClick} />
          </div>
        )}

        <SidebarProfile
          collapsed={collapsed}
          active={isProfileMenuOpen}
          ariaControls={profileMenuId}
          ariaExpanded={isProfileMenuOpen}
          onClick={handleProfileClick}
        />
        <AccountDialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen} />
      </div>
    </aside>
  );
}

function isSidebarItemActive(item: SidebarItem, pathname: string | null) {
  if (!pathname) {
    return false;
  }

  if (item.href === '/') {
    return pathname === '/';
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function SidebarNavItem({
  item,
  collapsed,
  active,
}: {
  item: SidebarItem;
  collapsed: boolean;
  active: boolean;
}) {
  return (
    <SidebarMenuItem
      label={item.label}
      icon={item.icon}
      href={item.href}
      active={active}
      collapsed={collapsed}
    />
  );
}

function SidebarProfileMenuItem({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: SidebarMenuItemIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex h-12 w-full cursor-pointer items-center gap-4 rounded-md px-2.5 py-2 text-left body-1-bold text-primary outline-none transition-colors hover:bg-gray-200 focus-visible:shadow-focus-ring"
      onClick={onClick}
    >
      <span className="flex size-8 shrink-0 items-center justify-center">
        <Icon className="size-6" />
      </span>
      <span>{label}</span>
    </button>
  );
}
