'use client';

import * as React from 'react';

import { CircleXIcon } from '@/components/common/icons/CircleXIcon';
import { SearchIcon } from '@/components/common/icons/SearchIcon';
import { cn } from '@/lib/utils';

export type SearchBarProps = Omit<React.ComponentProps<'input'>, 'type' | 'onChange'> & {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClear?: () => void;
};

export function SearchBar({
  className,
  value,
  defaultValue,
  onChange,
  onClear,
  onFocus,
  onBlur,
  placeholder = '경험을 검색해주세요',
  disabled,
  readOnly,
  ...props
}: SearchBarProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue?.toString() ?? '');
  const currentValue = value?.toString() ?? uncontrolledValue;
  const hasValue = currentValue.length > 0;
  const showSearchIcon = !hasValue && !focused;
  const canClear = hasValue && !disabled && !readOnly;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (value === undefined) {
      setUncontrolledValue(event.target.value);
    }

    onChange?.(event);
  }

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    setFocused(true);
    onFocus?.(event);
  }

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    setFocused(false);
    onBlur?.(event);
  }

  function handleClear() {
    if (!canClear) {
      return;
    }

    if (value === undefined) {
      setUncontrolledValue('');
    }

    onClear?.();
    inputRef.current?.focus();
  }

  return (
    <div
      className={cn(
        'flex h-11 w-full items-center gap-2 overflow-hidden rounded-md border border-solid border-border-thick bg-background-w px-2.5 py-1.5 text-tertiary transition-shadow focus-within:shadow-[0_0_0_3px_var(--color-mint-main)]',
        className,
      )}
    >
      {showSearchIcon && <SearchIcon className="size-8 shrink-0 p-1 text-tertiary" />}
      <input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className="h-8 min-w-0 flex-1 bg-transparent body-1-bold text-tertiary outline-none placeholder:text-tertiary"
        {...props}
      />
      {canClear && (
        <button
          type="button"
          aria-label="검색어 지우기"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-sm text-tertiary"
          onClick={handleClear}
        >
          <CircleXIcon className="size-6" />
        </button>
      )}
    </div>
  );
}
