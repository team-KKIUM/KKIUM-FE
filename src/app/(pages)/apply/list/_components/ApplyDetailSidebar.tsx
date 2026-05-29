'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import type { ApplyListItem } from '@/app/(pages)/apply/_constants/applyMockData';
import { ApplyDetailContent } from '@/app/(pages)/apply/list/_components/ApplyDetailContent';
import { cn } from '@/lib/utils';

export interface ApplyDetailSidebarProps {
  open: boolean;
  item: ApplyListItem | null;
  animated?: boolean;
  onClose: () => void;
}

export function ApplyDetailSidebar({
  open,
  item,
  animated = false,
  onClose,
}: ApplyDetailSidebarProps) {
  const router = useRouter();
  const [panelVisible, setPanelVisible] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      if (!animated) {
        setPanelVisible(true);
        return;
      }

      setPanelVisible(false);
      let secondFrame = 0;
      const firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => setPanelVisible(true));
      });

      return () => {
        window.cancelAnimationFrame(firstFrame);
        window.cancelAnimationFrame(secondFrame);
      };
    }

    setPanelVisible(false);
  }, [animated, open]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!item) {
    return null;
  }

  const handleExpand = () => {
    router.push(`/apply/list?selected=${encodeURIComponent(item.id)}&view=detail`);
  };

  return (
    <>
      <button
        type="button"
        aria-label="사이드바 닫기"
        className={cn(
          'fixed inset-0 z-40 bg-transparent',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        className={cn(
          'fixed top-0 right-0 z-50 flex h-screen w-[500px] flex-col overflow-hidden bg-[#FAFAFA] shadow-xl transform-gpu',
          'shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.10)]',
          'will-change-transform',
        )}
        style={{
          transform: panelVisible ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)',
          transition: animated
            ? 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)'
            : 'none',
        }}
      >
        <ApplyDetailContent item={item} variant="panel" onClose={onClose} onExpand={handleExpand} />
      </aside>
    </>
  );
}
