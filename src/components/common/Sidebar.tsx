'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ApplicationIcon } from '@/components/common/icons/ApplicationIcon';
import { CoverLetterIcon } from '@/components/common/icons/CoverLetterIcon';
import { ExperienceIcon } from '@/components/common/icons/ExperienceIcon';
import { HomeIcon } from '@/components/common/icons/HomeIcon';
import { JobAnalysisIcon } from '@/components/common/icons/JobAnalysisIcon';
import { SidebarMenuItem, type SidebarMenuItemIcon } from '@/components/common/SidebarMenuItem';
import { SidebarProfile } from '@/components/common/SidebarProfile';

import { cn } from '@/lib/utils';

export type SidebarItem = {
  label: string;
  icon: SidebarMenuItemIcon;
  href: string;
};

export interface SidebarProps {
  variant?: 'menu' | 'fullMenu';
  collapsed?: boolean;
}

const defaultPrimaryItems: SidebarItem[] = [
  // TODO: 페이지 경로가 정해지면 임시 href 값을 교체
  {
    label: '공고 분석',
    icon: JobAnalysisIcon,
    href: '#',
  },
  {
    label: '자기소개서 작성',
    icon: CoverLetterIcon,
    href: '#',
  },
];

const defaultSecondaryItems: SidebarItem[] = [
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
    href: '#',
  },
];

export function Sidebar({ variant = 'fullMenu', collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const primaryItems = variant === 'fullMenu' ? defaultPrimaryItems : [];
  const logoSrc = collapsed ? '/logo-light-mark.svg' : '/logo-light.svg';
  const logoSize = collapsed ? { width: 49, height: 49 } : { width: 136, height: 49 };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 flex h-dvh flex-col justify-between overflow-hidden border-r border-border-default bg-background-w py-[26px]',
        collapsed ? 'w-[73px] px-3' : 'w-[252px] px-6',
      )}
    >
      <div className="flex flex-col gap-5">
        <Image
          src={logoSrc}
          alt="KKIUM"
          width={logoSize.width}
          height={logoSize.height}
          priority
          className={cn(collapsed ? 'size-[49px]' : 'h-[49px] w-[136px]')}
        />

        <nav aria-label="주요 메뉴" className="flex flex-col">
          <SidebarSection
            collapsed={collapsed}
            items={primaryItems}
            pathname={pathname}
            withBorder
          />
          <SidebarSection collapsed={collapsed} items={defaultSecondaryItems} pathname={pathname} />
        </nav>
      </div>

      <SidebarProfile collapsed={collapsed} />
    </aside>
  );
}

function SidebarSection({
  collapsed,
  items,
  pathname,
  withBorder = false,
}: {
  collapsed: boolean;
  items: SidebarItem[];
  pathname: string | null;
  withBorder?: boolean;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-2.5 py-2.5', withBorder && 'border-b border-gray-300')}>
      {items.map((item) => (
        <SidebarNavItem
          key={item.label}
          item={item}
          collapsed={collapsed}
          active={isSidebarItemActive(item, pathname)}
        />
      ))}
    </div>
  );
}

function isSidebarItemActive(item: SidebarItem, pathname: string | null) {
  if (!pathname || item.href === '#') {
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
