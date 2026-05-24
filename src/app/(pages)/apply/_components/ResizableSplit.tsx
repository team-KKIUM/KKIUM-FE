'use client';

import * as React from 'react';

import {
  RESIZABLE_SPLIT_HANDLE_WIDTH,
  RESIZABLE_SPLIT_MIN_CONTAINER_WIDTH,
  RESIZABLE_SPLIT_MIN_LEFT_WIDTH,
  RESIZABLE_SPLIT_MIN_RIGHT_WIDTH,
  RESIZABLE_SPLIT_PANEL_INSET,
} from '../_constants/resizableSplitConstants';
import { cn } from '@/lib/utils';

export interface ResizableSplitLayout {
  minLeftWidth?: number;
  minRightWidth?: number;
  handleWidth?: number;
  panelInset?: number;
  minContainerWidth?: number;
}

export interface ResizableSplitProps {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
  separatorAriaLabel: string;
  layout?: ResizableSplitLayout;
}

function clampLeftWidth(
  width: number,
  containerWidth: number,
  minLeftWidth: number,
  minRightWidth: number,
  handleWidth: number,
) {
  const maxLeft = containerWidth - minRightWidth - handleWidth;
  const safeMaxLeft = Math.max(minLeftWidth, maxLeft);
  return Math.min(Math.max(width, minLeftWidth), safeMaxLeft);
}

export function ResizableSplit({
  left,
  right,
  className,
  separatorAriaLabel,
  layout,
}: ResizableSplitProps) {
  const minLeftWidth = layout?.minLeftWidth ?? RESIZABLE_SPLIT_MIN_LEFT_WIDTH;
  const minRightWidth = layout?.minRightWidth ?? RESIZABLE_SPLIT_MIN_RIGHT_WIDTH;
  const handleWidth = layout?.handleWidth ?? RESIZABLE_SPLIT_HANDLE_WIDTH;
  const panelInset = layout?.panelInset ?? RESIZABLE_SPLIT_PANEL_INSET;
  const minContainerWidth = layout?.minContainerWidth ?? RESIZABLE_SPLIT_MIN_CONTAINER_WIDTH;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);
  const [leftWidth, setLeftWidth] = React.useState(minLeftWidth);

  const updateLeftWidth = React.useCallback(
    (nextWidth: number) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const containerWidth = container.getBoundingClientRect().width;
      setLeftWidth(clampLeftWidth(nextWidth, containerWidth, minLeftWidth, minRightWidth, handleWidth));
    },
    [handleWidth, minLeftWidth, minRightWidth],
  );

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
        return clampLeftWidth(base, containerWidth, minLeftWidth, minRightWidth, handleWidth);
      });
    };

    const containerWidth = container.getBoundingClientRect().width;
    const balanced = Math.round((containerWidth - handleWidth) / 2);
    syncWidth(balanced);

    const resizeObserver = new ResizeObserver(() => {
      syncWidth();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [handleWidth, minLeftWidth, minRightWidth]);

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
      className={cn('flex w-full min-w-(--resizable-split-min-width) items-stretch', className)}
      style={
        { '--resizable-split-min-width': `${minContainerWidth}px` } as React.CSSProperties
      }
    >
      <div
        className="shrink-0 overflow-y-auto"
        style={{
          width: leftWidth,
          minWidth: minLeftWidth,
          paddingRight: panelInset,
        }}
      >
        {left}
      </div>

      <button
        type="button"
        role="separator"
        aria-orientation="vertical"
        aria-label={separatorAriaLabel}
        aria-valuenow={leftWidth}
        aria-valuemin={minLeftWidth}
        className="flex w-2.5 shrink-0 cursor-col-resize touch-none items-stretch justify-center border-x border-border-default bg-background-w"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={(event) => endDrag(event.currentTarget, event.pointerId)}
      >
        <span className="my-auto h-10 w-0.5 rounded-full bg-gray-300" />
      </button>

      <div
        className="flex-1 overflow-y-auto"
        style={{ minWidth: minRightWidth, paddingLeft: panelInset }}
      >
        {right}
      </div>
    </div>
  );
}
