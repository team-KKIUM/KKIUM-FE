'use client';

import * as React from 'react';

import { ExperienceDetailContent } from '@/app/experience/_components/ExperienceDetailContent';
import type { ExperienceItem } from '@/app/experience/_components/ExperienceCardGrid';
import { ExpandIcon } from '@/components/common/icons/ExpandIcon';
import { XIcon } from '@/components/common/icons/XIcon';
import { cn } from '@/lib/utils';

export interface ExperienceDetailPanelProps extends Omit<
  React.ComponentProps<'aside'>,
  'children'
> {
  experience: ExperienceItem;
  open: boolean;
  onExpand?: () => void;
  onEdit?: () => void;
  onSave?: (experience: Pick<ExperienceItem, 'detail' | 'skillTags' | 'competencyTags'>) => void;
  onClose: () => void;
}

export function ExperienceDetailPanel({
  experience,
  open,
  onExpand,
  onEdit,
  onSave,
  onClose,
  className,
  onKeyDown,
  ...props
}: ExperienceDetailPanelProps) {
  const titleId = React.useId();
  const panelRef = React.useRef<HTMLElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setEntered(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });

      return () => cancelAnimationFrame(id);
    }

    setEntered(false);
  }, [open]);

  React.useEffect(() => {
    const previousFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (open) {
      closeButtonRef.current?.focus();
    }

    return () => {
      if (previousFocusedElement?.isConnected) {
        previousFocusedElement.focus();
      }
    };
  }, [open]);

  React.useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      window.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose, open]);

  const handlePanelKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || event.key !== 'Tab') {
      return;
    }

    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const focusableElements = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute('disabled') && element.tabIndex !== -1);

    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      if (activeElement === firstElement || !panel.contains(activeElement)) {
        event.preventDefault();
        lastElement.focus();
      }

      return;
    }

    if (activeElement === lastElement || !panel.contains(activeElement)) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <aside
      ref={panelRef}
      data-slot="experience-detail-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={cn(
        'fixed top-0 right-0 z-40 flex h-dvh w-full max-w-[500px] flex-col bg-background-default px-6 pt-8 shadow-2xl',
        'transition-transform duration-300 ease-out will-change-transform',
        open && entered ? 'translate-x-0' : 'translate-x-full',
        className,
      )}
      onKeyDown={handlePanelKeyDown}
      {...props}
    >
      <header className="mb-6 grid h-8 grid-cols-[32px_1fr_32px] items-center">
        <button
          type="button"
          aria-label="경험 상세 확장 보기"
          className="flex size-8 cursor-pointer items-center justify-center text-primary"
          onClick={onExpand}
        >
          <ExpandIcon className="size-6" />
        </button>

        <h2 id={titleId} className="text-center heading-3-extra-bold text-strong">
          상세 경험
        </h2>

        <button
          ref={closeButtonRef}
          type="button"
          aria-label="경험 상세 패널 닫기"
          className="flex size-8 cursor-pointer items-center justify-center text-primary"
          onClick={onClose}
        >
          <XIcon className="size-6" />
        </button>
      </header>

      <ExperienceDetailContent
        experience={experience}
        variant="panel"
        onEdit={onEdit}
        onSave={onSave}
      />
    </aside>
  );
}
