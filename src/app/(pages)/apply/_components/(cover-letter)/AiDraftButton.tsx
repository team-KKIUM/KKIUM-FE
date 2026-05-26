'use client';

import type * as React from 'react';

import { AiDraftIcon } from '@/components/common/icons/AiDraftIcon';
import { cn } from '@/lib/utils';

export interface AiDraftButtonProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  className?: string;
}

export function AiDraftButton({ className, disabled, ...props }: AiDraftButtonProps) {
  return (
    <button
      type="button"
      data-slot="ai-draft-button"
      disabled={disabled}
      className={cn(
        'inline-flex h-8 shrink-0 items-center gap-1 overflow-hidden rounded-lg py-1 pr-2.5 pl-1',
        'body-3-bold text-on-fill shadow-[inset_0px_0px_4.2px_1px_rgba(255,255,255,0.4)]',
        'outline-none transition-[filter] focus-visible:shadow-focus-ring',
        'enabled:cursor-pointer enabled:bg-[radial-gradient(ellipse_62.5%_47.95%_at_51.28%_107.81%,var(--color-brand)_0%,var(--color-mint-300)_100%)] enabled:hover:brightness-105',
        'disabled:bg-[radial-gradient(ellipse_62.5%_47.95%_at_51.28%_107.81%,var(--color-gray-400)_0%,var(--color-gray-400)_100%)] disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <AiDraftIcon />
      AI 초안
    </button>
  );
}
