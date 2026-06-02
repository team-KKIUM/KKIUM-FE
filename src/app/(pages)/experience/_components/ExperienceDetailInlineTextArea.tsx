'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface ExperienceDetailInlineTextAreaProps {
  value: string;
  ariaLabel: string;
  maxLength?: number;
  className?: string;
  onChange: (value: string) => void;
}

export function ExperienceDetailInlineTextArea({
  value,
  ariaLabel,
  maxLength,
  className,
  onChange,
}: ExperienceDetailInlineTextAreaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = '0px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      aria-label={ariaLabel}
      maxLength={maxLength}
      rows={1}
      className={cn(
        'block min-h-[1.48em] w-full min-w-0 resize-none overflow-hidden bg-transparent p-0 leading-[1.48] outline-none',
        className,
      )}
      onChange={(event) => onChange(event.currentTarget.value.slice(0, maxLength))}
    />
  );
}
