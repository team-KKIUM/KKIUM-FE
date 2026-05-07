import * as React from 'react';

import { EmptyStateIllustration } from '@/components/common/EmptyStateIllustration';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  illustrationLabel?: string;
}

export function EmptyState({
  title,
  description,
  illustrationLabel = '비어 있는 상태',
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn('flex h-full w-full flex-col items-center justify-center', className)}
      {...props}
    >
      <EmptyStateIllustration label={illustrationLabel} />
      {(title || description) && (
        <div className="mt-3 flex flex-col items-center gap-1 text-center">
          {title && <p className="body-1-bold text-strong">{title}</p>}
          {description && <p className="body-2-regular text-gray-700">{description}</p>}
        </div>
      )}
    </div>
  );
}
