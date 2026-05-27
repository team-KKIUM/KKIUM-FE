'use client';

import * as React from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WarningTriangleIcon } from '@/components/common/icons/WarningTriangleIcon';

interface ErrorDialogProps {
  open: boolean;
  message: React.ReactNode;
  title?: string;
  confirmLabel?: string;
  onOpenChange: (open: boolean) => void;
}

export function ErrorDialog({
  open,
  message,
  title = '오류',
  confirmLabel = '확인',
  onOpenChange,
}: ErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{ width: 383, maxWidth: 'calc(100vw - 32px)' }}
        className="flex flex-col gap-0 rounded-xl bg-background-w px-[30px] py-5 text-strong shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.10)] ring-0"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex w-full flex-col items-center gap-5">
          <div className="flex w-[154px] flex-col items-center gap-1.5">
            <WarningTriangleIcon className="size-[70px]" />
            <DialogDescription className="whitespace-pre-line text-center body-1-regular leading-[1.6] text-strong">
              {message}
            </DialogDescription>
          </div>

          <DialogClose asChild>
            <Button type="button" className="h-10 w-full body-1-bold">
              {confirmLabel}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
