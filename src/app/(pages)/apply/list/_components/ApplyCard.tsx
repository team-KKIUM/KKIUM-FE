import Image from 'next/image';
import * as React from 'react';

import { CalendarIcon } from '@/components/common/icons/CalendarIcon';
import { MoreVerticalIcon } from '@/components/common/icons/MoreVerticalIcon';
import { PencilIcon } from '@/components/common/icons/PencilIcon';
import { cn } from '@/lib/utils';

export interface ApplyCardProps extends React.ComponentProps<'article'> {
  applyTitle: string;
  companyName: string;
  jobField: string;
  period: string;
  actionLabel?: string;
  selected?: boolean;
  onCardClick?: React.MouseEventHandler<HTMLElement>;
}

export function ApplyCard({
  applyTitle,
  companyName,
  jobField,
  period,
  actionLabel = '지원서 작성하기',
  selected = false,
  onCardClick,
  onClick,
  onKeyDown,
  className,
  ...props
}: ApplyCardProps) {
  const isInteractive = Boolean(onCardClick);

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

  return (
    <article
      data-slot="apply-card"
      data-state={selected ? 'selected' : 'default'}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      className={cn(
        'flex h-60 w-full max-w-[494px] flex-col justify-between gap-7 overflow-hidden rounded-xl border border-border-default bg-background-w px-5 py-7',
        selected &&
          'shadow-[0px_0px_0px_3px_rgba(114,224,206,1.00)] outline-1 outline-offset-[-1px] outline-border-default',
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

        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
            <h3 className="w-full truncate title-1-bold text-gray-main">{applyTitle}</h3>

            <div className="flex flex-col items-start gap-0.5">
              <div className="flex items-center gap-1.5 body-1-regular text-gray-800">
                <span>기업명</span>
                <span className="body-1-bold">{companyName}</span>
              </div>

              <div className="flex items-center gap-1.5 body-1-regular text-gray-800">
                <span>모집 분야</span>
                <span className="body-1-bold">{jobField}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 label-3-regular text-gray-600">
                <CalendarIcon className="size-5 text-gray-600" />
                <span>모집 기간</span>
              </div>
              <span className="label-3-regular text-gray-600">{period}</span>
            </div>
          </div>

          <button
            type="button"
            aria-label="카드 메뉴"
            className="flex size-8 shrink-0 items-center justify-center rounded bg-background-w text-gray-main"
          >
            <MoreVerticalIcon className="size-6" />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="inline-flex h-10 w-full items-center justify-center gap-1 rounded-lg bg-mint-50 px-3 py-1 text-mint-600"
      >
        <PencilIcon className="size-6" />
        <span className="body-1-bold">{actionLabel}</span>
      </button>
    </article>
  );
}
