import * as React from 'react';

import { cn } from '@/lib/utils';

export function DetailInput({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="detail-input"
      className={cn(
        'min-h-[146px] w-full resize-none rounded-[14px] border border-border-thick bg-background-w px-3 py-4 body-3-regular text-primary outline-none placeholder:text-quaternary focus:border-border-default focus:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600',
        className,
      )}
      {...props}
    />
  );
}
