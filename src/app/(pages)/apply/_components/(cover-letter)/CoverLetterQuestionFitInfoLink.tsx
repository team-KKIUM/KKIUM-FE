'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

import { ApplySectionInfoCard } from '../(analysis)/ApplySectionInfoCard';
import { InformationIcon } from '@/components/common/icons/InformationIcon';
import { cn } from '@/lib/utils';

import {
  APPLY_QUESTION_FIT_INFO_CARD_WIDTH,
  APPLY_SECTION_INFO_HORIZONTAL_MARGIN,
} from '../(analysis)/ApplySectionInfoCard';

type PopoverPosition = {
  top: number;
  left: number;
};

function getPopoverPosition(trigger: HTMLButtonElement): PopoverPosition {
  const rect = trigger.getBoundingClientRect();
  const margin = APPLY_SECTION_INFO_HORIZONTAL_MARGIN;
  const cardWidth = APPLY_QUESTION_FIT_INFO_CARD_WIDTH;

  let left = rect.left;
  left = Math.max(margin, Math.min(left, window.innerWidth - margin - cardWidth));

  return {
    top: rect.bottom + 8,
    left,
  };
}

export interface CoverLetterQuestionFitInfoLinkProps {
  className?: string;
}

export function CoverLetterQuestionFitInfoLink({ className }: CoverLetterQuestionFitInfoLinkProps) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [position, setPosition] = React.useState<PopoverPosition>({ top: 0, left: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) {
      return;
    }

    setPosition(getPopoverPosition(triggerRef.current));
  }, []);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (containerRef.current?.contains(target) || popoverRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, updatePosition]);

  return (
    <div ref={containerRef} className={cn('inline-flex items-center gap-1.5', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-label="문항 적합도 안내"
        className="inline-flex items-center gap-1.5 body-2-regular text-strong outline-none focus-visible:shadow-focus-ring"
        onClick={() => {
          setOpen((prev) => {
            const next = !prev;

            if (next) {
              requestAnimationFrame(updatePosition);
            }

            return next;
          });
        }}
      >
        <span>문항적합도는 무엇인가요?</span>
        <InformationIcon className="size-5 text-secondary" />
      </button>

      {mounted && open
        ? createPortal(
            <div
              ref={popoverRef}
              className="fixed z-100"
              style={{ top: position.top, left: position.left }}
            >
              <ApplySectionInfoCard variant="question-fit" />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
