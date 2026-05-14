import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { PlusIcon } from '@/components/common/icons/PlusIcon';
import { XIcon } from '@/components/common/icons/XIcon';
import { cn } from '@/lib/utils';

const tagVariants = cva(
  'inline-flex shrink-0 items-center rounded-sm px-3 py-1 font-bold whitespace-nowrap',
  {
    variants: {
      tone: {
        skill: 'bg-blue-50 text-blue-900',
        competency: 'bg-mint-50 text-success',
        neutral: 'bg-gray-200 text-gray-600',
      },
      size: {
        default: 'label-3-bold min-h-[27px]',
        large: 'body-1-bold min-h-8',
      },
      interactive: {
        true: 'gap-1',
        false: '',
      },
    },
    defaultVariants: {
      tone: 'skill',
      size: 'default',
      interactive: false,
    },
  },
);

export type TagProps = React.ComponentProps<'span'> &
  VariantProps<typeof tagVariants> & {
    addable?: boolean;
    removable?: boolean;
    disabled?: boolean;
    onRemove?: () => void;
  };

export function Tag({
  className,
  children,
  tone = 'skill',
  size = 'default',
  addable = false,
  removable = false,
  disabled = false,
  onRemove,
  ...props
}: TagProps) {
  const hasAction = addable || removable;
  const resolvedTone = disabled || addable ? 'neutral' : tone;
  const canRemove = removable && !disabled;
  const actionButtonClassName = size === 'large' ? 'size-[26px]' : 'size-[19px]';
  const actionIconClassName = size === 'large' ? 'size-6' : 'size-4 -translate-y-px';

  return (
    <span
      data-slot="tag"
      data-tone={resolvedTone}
      data-size={size}
      className={cn(
        tagVariants({ tone: resolvedTone, size, interactive: hasAction }),
        size === 'large' && removable && 'min-h-[34px]',
        className,
      )}
      {...props}
    >
      {children}
      {addable && <PlusIcon className="size-6 shrink-0" />}
      {removable && (
        <button
          type="button"
          aria-label={`${children?.toString() || '태그'} 삭제`}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          className={cn(
            'flex shrink-0 items-center justify-center disabled:cursor-not-allowed',
            actionButtonClassName,
          )}
          onClick={canRemove ? onRemove : undefined}
        >
          <XIcon className={actionIconClassName} />
        </button>
      )}
    </span>
  );
}

export { tagVariants };
