import Image from 'next/image';
import type { MouseEventHandler } from 'react';

import { cn } from '@/lib/utils';

interface SidebarProfileProps {
  collapsed?: boolean;
  active?: boolean;
  name?: string;
  profileSrc?: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function SidebarProfile({
  collapsed = false,
  active = false,
  name = 'KKIUM',
  profileSrc = '/profile.svg',
  ariaControls,
  ariaExpanded,
  onClick,
}: SidebarProfileProps) {
  return (
    <button
      type="button"
      data-slot="sidebar-profile"
      data-active={active || undefined}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      className={cn(
        'flex h-12 w-full cursor-pointer items-center rounded-md px-2.5 py-2 text-left outline-none focus-visible:shadow-focus-ring',
        active ? 'bg-gray-100' : 'hover:bg-gray-200',
        collapsed ? 'justify-center' : 'gap-4',
      )}
      onClick={onClick}
    >
      <Image src={profileSrc} alt="" width={32} height={32} className="size-8 shrink-0" />
      <span className={cn('min-w-0 flex-1 truncate body-3-bold text-primary', collapsed && 'sr-only')}>
        {name}
      </span>
    </button>
  );
}
