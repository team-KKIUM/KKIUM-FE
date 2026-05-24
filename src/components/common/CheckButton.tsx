'use client';

import * as React from 'react';

import { CheckOffIcon } from '@/components/common/icons/CheckOffIcon';
import { CheckOnIcon } from '@/components/common/icons/CheckOnIcon';
import { cn } from '@/lib/utils';

export interface CheckButtonProps extends Omit<React.ComponentProps<'button'>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function CheckButton({
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  className,
  disabled,
  onClick,
  ...props
}: CheckButtonProps) {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      onClick?.(event);
      return;
    }

    const nextChecked = !checked;

    if (!isControlled) {
      setUncontrolledChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);
    onClick?.(event);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      data-slot="check-button"
      data-state={checked ? 'checked' : 'unchecked'}
      className={cn(
        'inline-flex size-6 shrink-0 items-center justify-center rounded-sm outline-none transition-colors',
        'focus-visible:shadow-focus-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {checked ? (
        <CheckOnIcon className="size-6 text-mint-500" />
      ) : (
        <CheckOffIcon className="size-6 text-gray-500" />
      )}
    </button>
  );
}
