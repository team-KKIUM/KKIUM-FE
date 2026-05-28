import { EditIcon } from '@/components/common/icons/EditIcon';
import { NomalStarIcon } from '@/components/common/icons/NomalStarIcon';
import { TrashIcon } from '@/components/common/icons/TrashIcon';

export interface ApplyCardMenuDropdownProps {
  isTargeted?: boolean;
  disabled?: boolean;
  onEditTitle?: () => void;
  onToggleTarget?: () => void;
  onDelete?: () => void;
}

const buttonClassName =
  'inline-flex h-10 w-full cursor-pointer items-center justify-between gap-4 px-3 py-1 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-default disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-background-w';

export function ApplyCardMenuDropdown({
  isTargeted = false,
  disabled = false,
  onEditTitle,
  onToggleTarget,
  onDelete,
}: ApplyCardMenuDropdownProps) {

  return (
    <div
      className="absolute right-0 top-9 z-20 inline-flex w-56 flex-col overflow-hidden rounded-lg border border-border-default bg-background-w shadow-lg"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        disabled={disabled}
        className={`${buttonClassName} border-b border-gray-300`}
        onClick={onEditTitle}
      >
        <span className="min-w-0 flex-1 text-left body-1-bold text-gray-600">제목 수정하기</span>
        <EditIcon className="size-6 shrink-0 text-gray-600" />
      </button>

      <button
        type="button"
        disabled={disabled}
        className={`${buttonClassName} border-b border-gray-300`}
        onClick={onToggleTarget}
      >
        <span className="min-w-0 flex-1 text-left body-1-bold text-gray-600">
          {isTargeted ? '목표 공고 해제하기' : '목표 공고 등록하기'}
        </span>
        <NomalStarIcon className="size-6 shrink-0 text-gray-600" />
      </button>

      <button
        type="button"
        disabled={disabled}
        className={buttonClassName}
        onClick={onDelete}
      >
        <span className="min-w-0 flex-1 text-left body-1-bold text-red-300">삭제</span>
        <TrashIcon className="size-6 shrink-0 text-red-300" />
      </button>
    </div>
  );
}
