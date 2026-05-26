'use client';

import * as React from 'react';

import { ChevronDownIcon } from '@/components/common/icons/ChevronDownIcon';
import { ChevronUpIcon } from '@/components/common/icons/ChevronUpIcon';
import { CopyIcon } from '@/components/common/icons/CopyIcon';
import { StarIcon } from '@/components/common/icons/StarIcon';
import { ToastMessage } from '@/components/ui/ToastMessage';
import { cn } from '@/lib/utils';

export interface ApplyCoverLetterAiDraftPanelProps {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  draft: string;
  hasDraft?: boolean;
  onCopy?: () => void;
  className?: string;
}

export function ApplyCoverLetterAiDraftPanel({
  expanded,
  onExpandedChange,
  draft,
  hasDraft = false,
  onCopy,
  className,
}: ApplyCoverLetterAiDraftPanelProps) {
  const [toastOpen, setToastOpen] = React.useState(false);
  const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (!draft) {
      return;
    }

    try {
      await navigator.clipboard.writeText(draft);
      onCopy?.();
      setToastOpen(true);

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }

      toastTimerRef.current = setTimeout(() => {
        setToastOpen(false);
        toastTimerRef.current = null;
      }, 1600);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div
      data-slot="cover-letter-ai-draft-panel"
      data-expanded={expanded}
      className={cn('absolute inset-x-0 bottom-0 z-10 flex flex-col items-stretch', className)}
    >
      <div
        className={cn(
          'overflow-hidden transition-[max-height] duration-300 ease-out',
          expanded && hasDraft ? 'max-h-72' : 'max-h-0',
        )}
      >
        <div className="relative bg-mint-50 px-6 pt-12 pb-6">
          <button
            type="button"
            aria-expanded={expanded}
            aria-label="AI 초안 접기"
            onClick={() => onExpandedChange(false)}
            className="absolute top-3 left-1/2 flex size-8 -translate-x-1/2 items-center justify-center rounded text-tertiary outline-none focus-visible:shadow-focus-ring"
          >
            <ChevronDownIcon className="size-6" />
          </button>

          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1">
              <StarIcon className="size-6 text-primary" />
              <span className="text-xl font-bold leading-8 text-strong">AI 초안</span>
            </div>

            <button
              type="button"
              aria-label="AI 초안 복사"
              disabled={!draft}
              onClick={handleCopy}
              className="flex size-8 shrink-0 items-center justify-center rounded text-primary outline-none transition-colors hover:bg-mint-100 focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CopyIcon className="size-6" />
            </button>
          </div>

          <p className="max-h-44 overflow-y-auto text-base font-normal leading-6 text-strong">
            {draft}
          </p>
        </div>
      </div>

      {!expanded && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-label="AI 초안 펼치기"
          onClick={() => onExpandedChange(true)}
          className={cn(
            'relative z-10 -mt-px flex h-9 w-full items-start justify-center border-t-0 bg-mint-50 outline-none transition-colors',
            'focus-visible:shadow-focus-ring',
          )}
        >
          <span className="absolute left-1/2 -top-4 flex h-5 w-28 -translate-x-1/2 items-center justify-center bg-mint-50 text-brand [clip-path:polygon(14%_0,86%_0,100%_100%,0_100%)]">
            <ChevronUpIcon className="size-6" />
          </span>
        </button>
      )}
      <ToastMessage open={toastOpen} message="복사되었습니다" />
    </div>
  );
}
