import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'min-h-[152px] w-full resize-none rounded-lg border-[1.5px] border-solid border-border-bold bg-background-w p-4 body-2-regular text-strong outline-none placeholder:text-quaternary focus-visible:border-mint-main focus-visible:bg-mint-50/40 disabled:cursor-not-allowed disabled:bg-background-default disabled:text-quaternary disabled:placeholder:text-quaternary aria-invalid:border-red-700 aria-invalid:bg-red-50/40',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
