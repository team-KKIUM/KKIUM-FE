import Image from 'next/image';

import { cn } from '@/lib/utils';

interface SidebarProfileProps {
  collapsed?: boolean;
  active?: boolean;
  name?: string;
  email?: string;
}

export function SidebarProfile({
  collapsed = false,
  active = false,
  name = 'KKIUM',
  email = 'KKIUM.Kusism@naver.com',
}: SidebarProfileProps) {
  return (
    <div
      data-slot="sidebar-profile"
      data-active={active || undefined}
      className={cn(
        'flex h-12 items-center rounded-md px-2.5 py-2',
        active ? 'bg-gray-100' : 'hover:bg-gray-200',
        collapsed ? 'justify-center' : 'gap-4',
      )}
    >
      <Image src="/profile.svg" alt="" width={32} height={32} className="size-8 shrink-0" />
      <div className={cn('min-w-0 flex-1 flex-col gap-1', collapsed ? 'sr-only' : 'flex')}>
        <p className="body-3-bold text-primary">{name}</p>
        <p className="truncate label-4-bold text-quaternary">{email}</p>
      </div>
    </div>
  );
}
