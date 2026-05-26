'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';

import { UploadCompleteIcon } from '@/components/common/icons/UploadCompleteIcon';
import { cn } from '@/lib/utils';

export interface ToastMessageProps {
  open: boolean;
  message: string;
  className?: string;
}

export function ToastMessage({ open, message, className }: ToastMessageProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      data-slot="toast-message"
      className={cn(
        'fixed bottom-10 left-1/2 z-200 inline-flex -translate-x-1/2 items-center justify-center gap-1.5 rounded-full bg-gray-900 py-2 pr-5 pl-4 text-on-fill shadow-lg',
        className,
      )}
    >
      <UploadCompleteIcon className="size-5 shrink-0 text-on-fill" />
      <span className="body-3-bold text-on-fill">{message}</span>
    </div>,
    document.body,
  );
}
