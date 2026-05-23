'use client';

import * as React from 'react';

import {
  APPLY_RESIZE_HANDLE_WIDTH,
  APPLY_RESIZE_MIN_CONTAINER_WIDTH,
  APPLY_RESIZE_MIN_LEFT_WIDTH,
  APPLY_RESIZE_MIN_RIGHT_WIDTH,
  APPLY_RESIZE_PANEL_INSET,
} from '../_constants/applyResizableLayoutConstants';
import { cn } from '@/lib/utils';

export interface ApplyResizableSplitProps {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}

function clampLeftWidth(width: number, containerWidth: number) {
  const maxLeft = containerWidth - APPLY_RESIZE_MIN_RIGHT_WIDTH - APPLY_RESIZE_HANDLE_WIDTH;
  const safeMaxLeft = Math.max(APPLY_RESIZE_MIN_LEFT_WIDTH, maxLeft);
  return Math.min(Math.max(width, APPLY_RESIZE_MIN_LEFT_WIDTH), safeMaxLeft);
}

export function ApplyResizableSplit({ left, right, className }: ApplyResizableSplitProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);
  const [leftWidth, setLeftWidth] = React.useState(APPLY_RESIZE_MIN_LEFT_WIDTH);

  const updateLeftWidth = React.useCallback((nextWidth: number) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const containerWidth = container.getBoundingClientRect().width;
    setLeftWidth(clampLeftWidth(nextWidth, containerWidth));
  }, []);

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const syncWidth = (preferred?: number) => {
      const containerWidth = container.getBoundingClientRect().width;
      if (containerWidth <= 0) {
        return;
      }

      setLeftWidth((prev) => {
        const base = preferred ?? prev;
        return clampLeftWidth(base, containerWidth);
      });
    };

    const containerWidth = container.getBoundingClientRect().width;
    const balanced = Math.round((containerWidth - APPLY_RESIZE_HANDLE_WIDTH) / 2);
    syncWidth(balanced);

    const resizeObserver = new ResizeObserver(() => {
      syncWidth();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const endDrag = React.useCallback((target: HTMLButtonElement, pointerId: number) => {
    if (!isDraggingRef.current) {
      return;
    }

    isDraggingRef.current = false;
    target.releasePointerCapture(pointerId);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    isDraggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current || !containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    updateLeftWidth(event.clientX - rect.left);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    endDrag(event.currentTarget, event.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className={cn('flex w-full min-w-(--apply-resize-min-width) items-stretch', className)}
      style={
        { '--apply-resize-min-width': `${APPLY_RESIZE_MIN_CONTAINER_WIDTH}px` } as React.CSSProperties
      }
    >
      <div
        className="min-w-[453px] shrink-0 overflow-y-auto"
        style={{ width: leftWidth, paddingRight: APPLY_RESIZE_PANEL_INSET }}
      >
        {left}
      </div>

      <button
        type="button"
        role="separator"
        aria-orientation="vertical"
        aria-label="공고 분석과 내 경험 패널 너비 조절"
        aria-valuenow={leftWidth}
        aria-valuemin={APPLY_RESIZE_MIN_LEFT_WIDTH}
        className="flex w-2.5 shrink-0 cursor-col-resize touch-none items-stretch justify-center border-x border-border-default bg-background-w"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={(event) => endDrag(event.currentTarget, event.pointerId)}
      >
        <span className="my-auto h-10 w-0.5 rounded-full bg-gray-300" />
      </button>

      <div
        className="min-w-[492px] flex-1 overflow-y-auto"
        style={{ paddingLeft: APPLY_RESIZE_PANEL_INSET }}
      >
        {right}
      </div>
    </div>
  );
}
