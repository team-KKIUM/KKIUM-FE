import * as React from 'react';

import { cn } from '@/lib/utils';

export type DetailInputProps = React.ComponentPropsWithRef<'textarea'>;

export const DetailInput = React.forwardRef<HTMLTextAreaElement, DetailInputProps>(
  function DetailInput({ className, onInput, ...props }, ref) {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const resizeTextarea = React.useCallback(() => {
      const textarea = textareaRef.current;

      if (!textarea) {
        return;
      }

      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }, []);

    const setTextareaRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;

        if (typeof ref === 'function') {
          ref(node);
          return;
        }

        if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    React.useLayoutEffect(() => {
      resizeTextarea();
    }, [props.defaultValue, props.value, resizeTextarea]);

    const handleInput: DetailInputProps['onInput'] = (event) => {
      onInput?.(event);
      resizeTextarea();
    };

    return (
      <textarea
        ref={setTextareaRef}
        data-slot="detail-input"
        className={cn(
          'min-h-[146px] w-full resize-none overflow-hidden rounded-[14px] border border-border-thick bg-background-w px-3 py-4 body-3-regular text-primary outline-none placeholder:text-quaternary focus:border-border-default focus:bg-gray-100 read-only:cursor-default read-only:focus:border-border-thick read-only:focus:bg-background-w disabled:cursor-not-allowed disabled:text-gray-600',
          className,
        )}
        onInput={handleInput}
        {...props}
      />
    );
  },
);
