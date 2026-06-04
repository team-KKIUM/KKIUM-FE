'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { useApplyJobPostingStore } from '@/app/(pages)/apply/_stores/useApplyJobPostingStore';
import { ApplyCardMenuDropdown } from '@/app/(pages)/apply/list/_components/ApplyCardMenuDropdown';
import { CalendarIcon } from '@/components/common/icons/CalendarIcon';
import { PencilIcon } from '@/components/common/icons/PencilIcon';
import { cn } from '@/lib/utils';

export interface ApplyCardProps extends React.ComponentProps<'article'> {
  jdId: string;
  applyTitle: string;
  companyName: string;
  jobField: string;
  period: string;
  isTargeted?: boolean;
  menuActionDisabled?: boolean;
  selected?: boolean;
  priority?: boolean;
  onCardClick?: React.MouseEventHandler<HTMLElement>;
  onUpdateTitle?: (jdId: string, nextTitle: string) => void;
  onToggleTarget?: (jdId: string) => void;
  onDelete?: (jdId: string) => void;
}

export function ApplyCard({
  jdId,
  applyTitle,
  companyName,
  jobField,
  period,
  isTargeted = false,
  menuActionDisabled = false,
  selected = false,
  priority = false,
  onCardClick,
  onUpdateTitle,
  onToggleTarget,
  onDelete,
  onClick,
  onKeyDown,
  className,
  ...props
}: ApplyCardProps) {
  const isInteractive = Boolean(onCardClick);
  const [isTitleEditing, setIsTitleEditing] = React.useState(false);
  const [titleDraft, setTitleDraft] = React.useState(applyTitle);
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const setJobPosting = useApplyJobPostingStore((state) => state.setJobPosting);

  React.useEffect(() => {
    setTitleDraft(applyTitle);
  }, [applyTitle]);

  React.useEffect(() => {
    if (!isTitleEditing) {
      return;
    }

    const titleInput = titleInputRef.current;
    titleInput?.focus();
    titleInput?.setSelectionRange(titleInput.value.length, titleInput.value.length);
  }, [isTitleEditing]);

  const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
    onClick?.(event);
    onCardClick?.(event);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    onKeyDown?.(event);

    if (
      event.defaultPrevented ||
      event.target !== event.currentTarget ||
      !onCardClick
    ) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onCardClick(event as unknown as React.MouseEvent<HTMLElement>);
    }
  };

  const startTitleEditing = () => {
    setTitleDraft(applyTitle);
    setIsTitleEditing(true);
  };

  const cancelTitleEditing = () => {
    setTitleDraft(applyTitle);
    setIsTitleEditing(false);
  };

  const commitTitleEditing = () => {
    const nextTitle = titleDraft.trim();

    if (!nextTitle || nextTitle === applyTitle) {
      cancelTitleEditing();
      return;
    }

    onUpdateTitle?.(jdId, nextTitle);
    setTitleDraft(nextTitle);
    setIsTitleEditing(false);
    setJobPosting({
      jdId,
      title: nextTitle,
      companyName,
      jobField,
      period,
    });
  };

  const handleNavigateToApply = () => {
    setJobPosting({
      jdId,
      title: applyTitle,
      companyName,
      jobField,
      period,
    });
  };

  return (
    <article
      data-slot="apply-card"
      data-state={selected ? 'selected' : 'default'}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      className={cn(
        'flex min-h-60 w-full flex-col justify-between gap-7 overflow-hidden rounded-xl border border-border-default bg-background-w px-5 py-7',
        selected &&
          'shadow-[0px_0px_0px_3px_rgba(114,224,206,1.00)] outline-1 -outline-offset-1 outline-border-default',
        isInteractive &&
          'cursor-pointer hover:shadow-md focus-visible:shadow-focus-ring focus-visible:outline-none',
        className,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div className="flex w-full items-start gap-5">
        <Image
          src="/career-selected.svg"
          alt=""
          aria-hidden
          width={112}
          height={102}
          className="h-auto w-28 shrink-0"
          priority={priority}
          fetchPriority={priority ? 'high' : 'auto'}
        />

        <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
            {isTitleEditing ? (
              <input
                ref={titleInputRef}
                value={titleDraft}
                aria-label="공고 제목 수정"
                className="w-full min-w-0 truncate bg-transparent p-0 title-1-bold text-gray-main outline-none"
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
                onChange={(event) => setTitleDraft(event.currentTarget.value)}
                onBlur={commitTitleEditing}
                onKeyDown={(event) => {
                  event.stopPropagation();

                  if (event.nativeEvent.isComposing) {
                    return;
                  }

                  if (event.key === 'Enter') {
                    event.preventDefault();
                    commitTitleEditing();
                  }

                  if (event.key === 'Escape') {
                    event.preventDefault();
                    cancelTitleEditing();
                  }
                }}
              />
            ) : (
              <h3 className="w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap title-1-bold text-gray-main">
                {applyTitle}
              </h3>
            )}

            <div className="flex w-full min-w-0 flex-col gap-0.5">
              <div className="flex w-full min-w-0 items-center gap-1.5">
                <span className="shrink-0 whitespace-nowrap body-1-regular text-gray-800">
                  기업명
                </span>
                <span className="min-w-0 truncate body-1-bold text-gray-800">{companyName}</span>
              </div>

              <div className="flex w-full min-w-0 items-center gap-1.5">
                <span className="shrink-0 whitespace-nowrap body-1-regular text-gray-800">
                  모집 분야
                </span>
                <span className="min-w-0 truncate body-1-bold text-gray-800">{jobField}</span>
              </div>
            </div>

            <div className="flex min-w-0 items-start gap-1.5">
              <div className="flex shrink-0 items-center gap-0.5 whitespace-nowrap label-3-regular text-gray-600">
                <CalendarIcon className="size-5 text-gray-600" />
                <span>모집 기간</span>
              </div>
              <span className="min-w-0 flex-1 wrap-break-word label-3-regular text-gray-600">
                {period}
              </span>
            </div>
          </div>

          <ApplyCardMenuDropdown
            isTargeted={isTargeted}
            disabled={menuActionDisabled}
            triggerClassName="shrink-0"
            onEditTitle={startTitleEditing}
            onToggleTarget={() => onToggleTarget?.(jdId)}
            onDelete={() => onDelete?.(jdId)}
          />
        </div>
      </div>

      <Link
        href={`/apply?jdId=${encodeURIComponent(jdId)}`}
        className="inline-flex h-10 w-full items-center justify-center gap-1 overflow-hidden rounded-lg bg-background-w px-3 py-1 text-gray-600 outline -outline-offset-1 outline-border-default transition-colors hover:bg-gray-100"
        onClick={(event) => {
          event.stopPropagation();
          handleNavigateToApply();
        }}
      >
        <PencilIcon className="size-6 text-gray-600" />
        <span className="body-1-bold text-gray-600">자기소개서 작성하기</span>
      </Link>
    </article>
  );
}
