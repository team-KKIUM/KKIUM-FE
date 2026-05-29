'use client';

import { Info } from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import {
  APPLY_SECTION_INFO_HORIZONTAL_MARGIN,
  ApplySectionInfoCard,
  EXPERIENCE_MATCH_INFO_CARD_WIDTH,
} from '@/app/(pages)/apply/_components/(analysis)/ApplySectionInfoCard';
import { cn } from '@/lib/utils';

type PopoverPosition = {
  top: number;
  left: number;
};

function getPopoverPosition(trigger: HTMLButtonElement): PopoverPosition {
  const rect = trigger.getBoundingClientRect();
  const margin = APPLY_SECTION_INFO_HORIZONTAL_MARGIN;
  const cardWidth = EXPERIENCE_MATCH_INFO_CARD_WIDTH;

  let left = rect.right - cardWidth;
  left = Math.max(margin, Math.min(left, window.innerWidth - margin - cardWidth));

  return {
    top: rect.bottom + 8,
    left,
  };
}

export interface ExperienceMatchGaugeInfoProps {
  ariaLabel?: string;
  className?: string;
}

export function ExperienceMatchGaugeInfo({
  ariaLabel = '적합도 안내',
  className,
}: ExperienceMatchGaugeInfoProps) {
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
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        className="flex size-6 items-center justify-center rounded text-secondary outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring"
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
        <Info className="size-5" aria-hidden />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-50"
            style={{ top: position.top, left: position.left }}
          >
            <ApplySectionInfoCard variant="job-analysis" width={EXPERIENCE_MATCH_INFO_CARD_WIDTH} />
          </div>,
          document.body,
        )}
    </div>
  );
}
