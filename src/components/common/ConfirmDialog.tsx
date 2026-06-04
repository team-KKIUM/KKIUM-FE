'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
  confirming?: boolean;
  destructive?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  cancelLabel = '취소하기',
  confirmLabel = '확인하기',
  confirming = false,
  destructive = false,
  onOpenChange,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{ width: 350, maxWidth: 'calc(100vw - 32px)' }}
        className="flex flex-col gap-8 rounded-xl bg-background-w px-6 pt-6 pb-5 text-strong"
      >
        <div className="flex w-full flex-col gap-1">
          <DialogTitle className="title-1-bold text-strong">{title}</DialogTitle>
          <DialogDescription className="body-2-regular text-gray-700">
            {description}
          </DialogDescription>
        </div>

        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button type="button" variant="line" disabled={confirming} className="h-10 w-[83px] px-3">
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={destructive ? 'dangerFill' : 'default'}
            disabled={confirming}
            className="h-10 w-[83px] px-3"
            onClick={() => void onConfirm()}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
