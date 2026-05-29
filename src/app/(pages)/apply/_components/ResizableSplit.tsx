'use client';

import * as React from 'react';

import {
  RESIZABLE_SPLIT_HANDLE_WIDTH,
  RESIZABLE_SPLIT_MIN_HEIGHT,
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
  leftPanelInset?: number;
  rightPanelInset?: number;
  minHeight?: number;
}

export interface ResizableSplitProps {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
  separatorClassName?: string;
  separatorAriaLabel: string;
  layout?: ResizableSplitLayout;
}

type PanelConstraints = {
  effectiveMinLeft: number;
  effectiveMinRight: number;
  maxLeft: number;
};

/** 드래그 가능 범위가 남도록 좌·우 최소 너비와 maxLeft를 계산한다. */
function resolvePanelConstraints(
  containerWidth: number,
  minLeftWidth: number,
  minRightWidth: number,
  handleWidth: number,
): PanelConstraints {
  if (containerWidth <= handleWidth) {
    return {
      effectiveMinLeft: minLeftWidth,
      effectiveMinRight: minRightWidth,
      maxLeft: minLeftWidth,
    };
  }

  const minTotal = minLeftWidth + minRightWidth + handleWidth;

  if (containerWidth >= minTotal) {
    return {
      effectiveMinLeft: minLeftWidth,
      effectiveMinRight: minRightWidth,
      maxLeft: containerWidth - minRightWidth - handleWidth,
    };
  }

  const available = containerWidth - handleWidth;
  const resizeSlack = Math.min(160, Math.floor(available * 0.15));
  const effectiveMinRight = Math.max(
    280,
    Math.min(minRightWidth, Math.floor(available * 0.52)),
  );
  const maxLeft = containerWidth - effectiveMinRight - handleWidth;
  const effectiveMinLeft = Math.max(
    200,
    Math.min(minLeftWidth, maxLeft - resizeSlack),
  );

  return {
    effectiveMinLeft,
    effectiveMinRight,
    maxLeft: Math.max(effectiveMinLeft, maxLeft),
  };
}

function clampLeftWidth(
  width: number,
  containerWidth: number,
  minLeftWidth: number,
  minRightWidth: number,
  handleWidth: number,
) {
  const { effectiveMinLeft, maxLeft } = resolvePanelConstraints(
    containerWidth,
    minLeftWidth,
    minRightWidth,
    handleWidth,
  );

  return Math.min(Math.max(width, effectiveMinLeft), maxLeft);
}

function getBalancedLeftWidth(
  containerWidth: number,
  minLeftWidth: number,
  minRightWidth: number,
  handleWidth: number,
) {
  const preferred = Math.round((containerWidth - handleWidth) / 2);
  return clampLeftWidth(preferred, containerWidth, minLeftWidth, minRightWidth, handleWidth);
}

export function ResizableSplit({
  left,
  right,
  className,
  leftClassName,
  rightClassName,
  separatorClassName,
  separatorAriaLabel,
  layout,
}: ResizableSplitProps) {
  const minLeftWidth = layout?.minLeftWidth ?? RESIZABLE_SPLIT_MIN_LEFT_WIDTH;
  const minRightWidth = layout?.minRightWidth ?? RESIZABLE_SPLIT_MIN_RIGHT_WIDTH;
  const handleWidth = layout?.handleWidth ?? RESIZABLE_SPLIT_HANDLE_WIDTH;
  const panelInset = layout?.panelInset ?? RESIZABLE_SPLIT_PANEL_INSET;
  const leftPanelInset = layout?.leftPanelInset ?? 0;
  const rightPanelInset = layout?.rightPanelInset ?? panelInset;
  const minHeight = layout?.minHeight ?? RESIZABLE_SPLIT_MIN_HEIGHT;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);
  const hasInitializedRef = React.useRef(false);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [leftWidth, setLeftWidth] = React.useState(minLeftWidth);

  const constraints = React.useMemo(
    () =>
      resolvePanelConstraints(
        containerWidth,
        minLeftWidth,
        minRightWidth,
        handleWidth,
      ),
    [containerWidth, handleWidth, minLeftWidth, minRightWidth],
  );

  const updateLeftWidth = React.useCallback(
    (nextWidth: number) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const width = container.getBoundingClientRect().width;
      setLeftWidth(clampLeftWidth(nextWidth, width, minLeftWidth, minRightWidth, handleWidth));
    },
    [handleWidth, minLeftWidth, minRightWidth],
  );

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const measure = () => {
      const width = container.getBoundingClientRect().width;
      if (width <= 0) {
        return;
      }

      setContainerWidth(width);

      if (isDraggingRef.current) {
        return;
      }

      setLeftWidth((prev) => {
        if (!hasInitializedRef.current) {
          hasInitializedRef.current = true;
          return getBalancedLeftWidth(width, minLeftWidth, minRightWidth, handleWidth);
        }

        return clampLeftWidth(prev, width, minLeftWidth, minRightWidth, handleWidth);
      });
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [handleWidth, minLeftWidth, minRightWidth]);

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current || !containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      updateLeftWidth(event.clientX - rect.left);
    };

    const handlePointerEnd = () => {
      if (!isDraggingRef.current) {
        return;
      }

      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerEnd);
    window.addEventListener('pointercancel', handlePointerEnd);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerEnd);
      window.removeEventListener('pointercancel', handlePointerEnd);
    };
  }, [updateLeftWidth]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex w-full min-w-0 items-stretch',
        `min-h-(--resizable-split-min-height)`,
        className,
      )}
      style={
        {
          '--resizable-split-min-height': `${minHeight}px`,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          'flex min-h-full min-w-0 shrink-0 flex-col overflow-y-auto overflow-x-hidden',
          leftClassName,
        )}
        style={{
          width: leftWidth,
          minWidth: constraints.effectiveMinLeft,
          paddingLeft: leftPanelInset,
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
        aria-valuemin={constraints.effectiveMinLeft}
        aria-valuemax={constraints.maxLeft}
        className={cn(
          'relative z-20 flex w-2.5 shrink-0 cursor-col-resize touch-none items-stretch justify-center border-x border-border-default bg-background-w',
          separatorClassName,
        )}
        onPointerDown={handlePointerDown}
      >
        <span className="pointer-events-none my-auto h-10 w-0.5 rounded-full bg-gray-300" />
      </button>

      <div
        className={cn(
          'flex min-h-full min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden',
          rightClassName,
        )}
        style={{
          minWidth: constraints.effectiveMinRight,
          paddingLeft: rightPanelInset,
        }}
      >
        {right}
      </div>
    </div>
  );
}
