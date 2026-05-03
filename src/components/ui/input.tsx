import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-[54px] w-full min-w-0 rounded-lg border-[1.5px] border-border-bold bg-background-w p-4 body-2-regular text-strong outline-none placeholder:text-quaternary focus-visible:border-mint-main focus-visible:bg-mint-50/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-background-default disabled:text-quaternary disabled:placeholder:text-quaternary aria-invalid:border-red-700 aria-invalid:bg-red-50/40',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
