import Link from 'next/link';
import type { MouseEventHandler, SVGProps } from 'react';

import { cn } from '@/lib/utils';

export type SidebarMenuItemIcon = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

export interface SidebarMenuItemProps {
  label: string;
  icon: SidebarMenuItemIcon;
  href: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export function SidebarMenuItem({
  label,
  icon: Icon,
  href,
  active = false,
  collapsed = false,
  onClick,
}: SidebarMenuItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex h-12 items-center rounded-md px-2.5 py-2 focus-visible:outline-none',
        active
          ? 'bg-mint-50 text-mint-600 focus-visible:bg-mint-50'
          : 'text-quaternary hover:bg-gray-200 focus-visible:bg-gray-200',
        collapsed ? 'justify-center' : 'gap-4',
      )}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? label : undefined}
      onClick={onClick}
    >
      <span className="flex size-8 shrink-0 items-center justify-center">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <span className={cn('body-1-bold whitespace-nowrap', collapsed && 'sr-only')}>{label}</span>
    </Link>
  );
}
