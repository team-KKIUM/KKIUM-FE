'use client';

import { EditIcon } from '@/components/common/icons/EditIcon';
import { MoreVerticalIcon } from '@/components/common/icons/MoreVerticalIcon';
import { NomalStarIcon } from '@/components/common/icons/NomalStarIcon';
import { StarIcon } from '@/components/common/icons/StarIcon';
import { TrashIcon } from '@/components/common/icons/TrashIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface ApplyCardMenuDropdownProps {
  isTargeted?: boolean;
  disabled?: boolean;
  onEditTitle?: () => void;
  onToggleTarget?: () => void;
  onDelete?: () => void;
  triggerClassName?: string;
}

export function ApplyCardMenuDropdown({
  isTargeted = false,
  disabled = false,
  onEditTitle,
  onToggleTarget,
  onDelete,
  triggerClassName,
}: ApplyCardMenuDropdownProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="카드 메뉴"
          disabled={disabled}
          className={cn(
            'flex size-8 cursor-pointer items-center justify-center rounded bg-background-w text-gray-main hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default disabled:cursor-not-allowed disabled:opacity-50',
            triggerClassName,
          )}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <MoreVerticalIcon className="size-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <DropdownMenuItem
          className="active:bg-gray-300"
          disabled={disabled}
          onSelect={(event) => {
            event.stopPropagation();
            onEditTitle?.();
          }}
        >
          <span>제목 수정하기</span>
          <span className="flex size-8 items-center justify-center">
            <EditIcon className="size-6 text-tertiary" />
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="active:bg-gray-300"
          disabled={disabled}
          onSelect={(event) => {
            event.stopPropagation();
            onToggleTarget?.();
          }}
        >
          <span>{isTargeted ? '목표 공고 해제하기' : '목표 공고 등록하기'}</span>
          <span className="flex size-8 items-center justify-center">
            {isTargeted ? (
              <NomalStarIcon className="size-6 text-[#FBC548]" />
            ) : (
              <NomalStarIcon className="size-6 text-tertiary" />
            )}
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          variant="destructive"
          className="active:bg-gray-300"
          disabled={disabled}
          onSelect={(event) => {
            event.stopPropagation();
            onDelete?.();
          }}
        >
          <span>삭제</span>
          <span className="flex size-8 items-center justify-center">
            <TrashIcon className="size-6 text-red-300" />
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
