'use client';

import Image from 'next/image';

import { HOME_DASHBOARD_CONTENT_CLASS } from '@/app/_constants/homeLayoutConstants';
import { ExternalLinkIcon } from '@/components/common/icons/ExternalLinkIcon';
import { cn } from '@/lib/utils';

export interface NullComponentProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
}

const DEFAULT_TITLE = '아직 등록된 목표 공고가 없어요';
const DEFAULT_DESCRIPTION = '공고를 추가해 목표를 정해볼까요?';
const DEFAULT_CTA = '공고 등록하러 가기';

export function NullComponent({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  ctaLabel = DEFAULT_CTA,
  onCtaClick,
  className,
}: NullComponentProps) {
  return (
    <div
      data-slot="null-component"
      className={cn(
        'flex h-90 items-center justify-center gap-6 rounded-xl border border-border-bold bg-background-w p-3',
        HOME_DASHBOARD_CONTENT_CLASS,
        className,
      )}
    >
      <div className="flex h-72 w-96 shrink-0 flex-col items-center justify-center">
        <Image
          src="/empty-state.svg"
          alt=""
          width={260}
          height={206}
          className="h-auto max-h-full w-auto max-w-[min(100%,260px)] object-contain"
          loading="lazy"
          unoptimized
        />
      </div>

      <div className="flex h-72 w-[578px] shrink-0 flex-col items-center justify-center rounded-xl bg-background-w px-6">
        <div className="mb-4 flex w-[376px] max-w-full flex-col items-center gap-1 text-center">
          <p className="break-keep text-xl font-bold leading-7 text-strong">{title}</p>
          <p className="break-keep text-base leading-6 text-gray-700">{description}</p>
        </div>

        <button
          type="button"
          onClick={onCtaClick}
          className={cn(
            'inline-flex h-10 w-80 max-w-full shrink-0 items-center justify-center gap-1 overflow-hidden rounded-lg px-3 py-1',
            'body-1-bold text-on-fill outline-none transition-colors',
            'bg-gray-main hover:bg-gray-800 focus-visible:shadow-focus-ring',
            onCtaClick == null && 'cursor-default',
          )}
        >
          <span className="leading-6">{ctaLabel}</span>
          <ExternalLinkIcon className="size-6 shrink-0 text-on-fill" />
        </button>
      </div>
    </div>
  );
}
