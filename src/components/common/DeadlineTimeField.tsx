'use client';

import * as React from 'react';

import { ClockIcon } from '@/components/common/icons/ClockIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function formatDeadlineTimeDisplay(value: string): string {
  if (!value) return '';
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
  const period = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 || 12;
  return `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

/** 00:00 ~ 23:00, 1시간 단위 */
export const HOURLY_TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
  const value = `${String(hour).padStart(2, '0')}:00`;
  return { value, label: formatDeadlineTimeDisplay(value) };
});

export interface DeadlineTimeFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function DeadlineTimeField({
  value,
  onChange,
  disabled = false,
  placeholder = '00:00 pm',
  className,
}: DeadlineTimeFieldProps) {
  const [open, setOpen] = React.useState(false);
  const display = value ? formatDeadlineTimeDisplay(value) : placeholder;

  return (
    <DropdownMenu
      open={disabled ? false : open}
      onOpenChange={(next) => {
        if (!disabled) setOpen(next);
      }}
    >
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            'flex h-14 w-full items-center gap-2 rounded-lg border border-gray-300 bg-background-default px-4 text-left outline-none transition-colors',
            'hover:border-gray-400 focus-visible:border-mint-main focus-visible:shadow-focus-ring',
            disabled && 'pointer-events-none cursor-not-allowed opacity-60',
            className,
          )}
        >
          <ClockIcon className="size-6 shrink-0 text-quaternary" aria-hidden />
          <span
            className={cn(
              'min-w-0 flex-1 truncate body-2-regular',
              value ? 'text-strong' : 'text-quaternary',
            )}
          >
            {display}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        className="max-h-60 w-(--radix-dropdown-menu-trigger-width) min-w-(--radix-dropdown-menu-trigger-width) overflow-y-auto p-0"
      >
        {HOURLY_TIME_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={cn(
              'min-h-10 border-b border-border-bold last:border-b-0',
              value === option.value && 'bg-gray-100',
            )}
            onSelect={() => {
              onChange(option.value);
              setOpen(false);
            }}
          >
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
