'use client';

import * as React from 'react';

import { EditIcon } from '@/components/common/icons/EditIcon';
import { MoreVerticalIcon } from '@/components/common/icons/MoreVerticalIcon';
import { TrashIcon } from '@/components/common/icons/TrashIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface ExperienceCardDropdownMenuProps extends React.ComponentProps<typeof DropdownMenu> {
  onEditTitle?: React.ComponentProps<typeof DropdownMenuItem>['onSelect'];
  onDelete?: React.ComponentProps<typeof DropdownMenuItem>['onSelect'];
  triggerClassName?: string;
}

export function ExperienceCardDropdownMenu({
  modal = false,
  onEditTitle,
  onDelete,
  triggerClassName,
  ...props
}: ExperienceCardDropdownMenuProps) {
  return (
    <DropdownMenu modal={modal} {...props}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="경험 카드 메뉴"
          className={cn(
            'flex size-8 cursor-pointer items-center justify-center text-gray-main',
            triggerClassName,
          )}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <MoreVerticalIcon className="size-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuItem className="active:bg-gray-300" onSelect={onEditTitle}>
          <span>제목 수정하기</span>
          <span className="flex size-8 items-center justify-center">
            <EditIcon className="size-6 text-tertiary" />
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem className="active:bg-gray-300" onSelect={onDelete}>
          <span>삭제</span>
          <span className="flex size-8 items-center justify-center">
            <TrashIcon className="size-6 text-tertiary" />
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
