'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { useApplyJobPostingStore } from '@/app/(pages)/apply/_stores/useApplyJobPostingStore';
import { ApplyCardMenuDropdown } from '@/app/(pages)/apply/list/_components/ApplyCardMenuDropdown';
import { CalendarIcon } from '@/components/common/icons/CalendarIcon';
import { MoreVerticalIcon } from '@/components/common/icons/MoreVerticalIcon';
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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isTitleEditing, setIsTitleEditing] = React.useState(false);
  const [titleDraft, setTitleDraft] = React.useState(applyTitle);
  const menuContainerRef = React.useRef<HTMLDivElement>(null);
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const setJobPosting = useApplyJobPostingStore((state) => state.setJobPosting);

  React.useEffect(() => {
    setTitleDraft(applyTitle);
  }, [applyTitle]);

  React.useEffect(() => {
    if (isTitleEditing) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isTitleEditing]);

  React.useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuContainerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

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
    setIsMenuOpen(false);
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
        'flex h-60 w-full max-w-[520px] flex-col justify-between gap-7 overflow-hidden rounded-xl border border-border-default bg-background-w px-5 py-7',
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
        />

        <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
            {isTitleEditing ? (
              <input
                ref={titleInputRef}
                value={titleDraft}
                aria-label="공고 제목 수정"
                className="w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-border-default bg-background-w px-1 title-1-bold text-gray-main outline-none focus-visible:shadow-focus-ring"
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => setTitleDraft(event.currentTarget.value)}
                onBlur={commitTitleEditing}
                onKeyDown={(event) => {
                  event.stopPropagation();

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

            <div className="flex min-w-0 items-center gap-1.5">
              <div className="flex shrink-0 items-center gap-0.5 whitespace-nowrap label-3-regular text-gray-600">
                <CalendarIcon className="size-5 text-gray-600" />
                <span>모집 기간</span>
              </div>
              <span className="min-w-0 flex-1 truncate whitespace-nowrap label-3-regular text-gray-600">
                {period}
              </span>
            </div>
          </div>

          <div ref={menuContainerRef} className="relative shrink-0">
            <button
              type="button"
              aria-label="카드 메뉴"
              aria-expanded={isMenuOpen}
              className="flex size-8 cursor-pointer items-center justify-center rounded bg-background-w text-gray-main hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-default"
              onClick={(event) => {
                event.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
            >
              <MoreVerticalIcon className="size-6" />
            </button>

            {isMenuOpen && (
              <ApplyCardMenuDropdown
                isTargeted={isTargeted}
                disabled={menuActionDisabled}
                onEditTitle={startTitleEditing}
                onToggleTarget={() => {
                  onToggleTarget?.(jdId);
                  setIsMenuOpen(false);
                }}
                onDelete={() => {
                  onDelete?.(jdId);
                  setIsMenuOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </div>

      <Link
        href={`/apply?jdId=${encodeURIComponent(jdId)}`}
        className="inline-flex h-10 w-full items-center justify-center gap-1 overflow-hidden rounded-lg bg-background-w px-3 py-1 text-gray-600 outline -outline-offset-1 outline-border-default"
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
