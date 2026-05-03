import * as React from 'react';

import { cn } from '@/lib/utils';

export function Container({ className, children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="container"
      className={cn(
        'min-h-[146px] w-full rounded-[14px] bg-background-default px-3 py-4',
        className,
      )}
      {...props}
    >
      <p className="body-3-regular text-[#364153]">{children}</p>
    </div>
  );
}
