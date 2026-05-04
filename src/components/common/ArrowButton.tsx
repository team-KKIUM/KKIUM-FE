import * as React from 'react';

import { ChevronLeftIcon } from '@/components/common/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/common/icons/ChevronRightIcon';
import { cn } from '@/lib/utils';

export interface ArrowButtonProps extends React.ComponentProps<'button'> {
  direction: 'left' | 'right';
}

export function ArrowButton({
  direction,
  className,
  'aria-label': ariaLabel,
  ...props
}: ArrowButtonProps) {
  const Icon = direction === 'left' ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      type="button"
      data-slot="arrow-button"
      data-direction={direction}
      aria-label={ariaLabel ?? (direction === 'left' ? '이전' : '다음')}
      className={cn(
        'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-sm bg-gray-800 text-on-fill transition-all hover:bg-gray-500 hover:text-gray-200 hover:shadow-sm focus-visible:bg-gray-500 focus-visible:text-gray-200 focus-visible:shadow-sm focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-100',
        className,
      )}
      {...props}
    >
      <Icon className="size-6" />
    </button>
  );
}
