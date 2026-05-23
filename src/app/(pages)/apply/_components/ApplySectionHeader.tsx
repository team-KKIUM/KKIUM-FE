'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

import { InformationIcon } from '@/components/common/icons/InformationIcon';
import { cn } from '@/lib/utils';

import {
  APPLY_SECTION_INFO_CARD_WIDTH,
  APPLY_SECTION_INFO_HORIZONTAL_MARGIN,
  ApplySectionInfoCard,
  type ApplySectionInfoVariant,
} from './ApplySectionInfoCard';

export interface ApplySectionHeaderProps {
  title: string;
  infoVariant?: ApplySectionInfoVariant;
  className?: string;
}

type PopoverPosition = {
  top: number;
  left: number;
};

function getPopoverPosition(trigger: HTMLButtonElement): PopoverPosition {
  const rect = trigger.getBoundingClientRect();
  const margin = APPLY_SECTION_INFO_HORIZONTAL_MARGIN;
  const cardWidth = APPLY_SECTION_INFO_CARD_WIDTH;

  let left = rect.right - cardWidth;
  left = Math.max(margin, Math.min(left, window.innerWidth - margin - cardWidth));

  return {
    top: rect.bottom + 8,
    left,
  };
}

export function ApplySectionHeader({ title, infoVariant, className }: ApplySectionHeaderProps) {
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
      if (
        containerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
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
    <div ref={containerRef} className={cn('flex w-full items-center justify-between', className)}>
      <h2 className="text-2xl font-extrabold leading-9 text-strong">{title}</h2>

      {infoVariant && (
        <>
          <button
            ref={triggerRef}
            type="button"
            aria-label={`${title} 정보`}
            aria-expanded={open}
            className="flex size-5 shrink-0 items-center justify-center text-secondary"
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
            <InformationIcon className="size-5" />
          </button>

          {mounted &&
            open &&
            createPortal(
              <div
                ref={popoverRef}
                className="fixed z-50"
                style={{ top: position.top, left: position.left }}
              >
                <ApplySectionInfoCard variant={infoVariant} />
              </div>,
              document.body,
            )}
        </>
      )}
    </div>
  );
}
