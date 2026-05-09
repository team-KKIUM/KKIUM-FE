'use client';

import * as React from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { XIcon } from '@/components/common/icons/XIcon';
import { cn } from '@/lib/utils';

export interface ModalProps extends Omit<React.ComponentProps<typeof Dialog>, 'children'> {
  children: React.ReactNode;
  contentClassName?: string;
  showCloseButton?: boolean;
}

function Modal({ children, contentClassName, showCloseButton = false, ...props }: ModalProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn(
          'flex max-h-[calc(100dvh-40px)] w-[calc(100vw-var(--app-content-left,0px)-32px)] max-w-[864px] flex-col items-stretch gap-6 overflow-y-auto rounded-xl border border-border-default bg-background-w px-[30px] py-5 text-strong ring-0 sm:max-w-[864px]',
          'left-[calc((var(--app-content-left,0px)+100vw)/2)]',
          contentClassName,
        )}
      >
        {children}
        {showCloseButton && (
          <DialogClose asChild>
            <button
              type="button"
              aria-label="모달 닫기"
              className="absolute top-5 right-[30px] flex size-8 cursor-pointer items-center justify-center rounded-sm bg-background-w text-gray-main"
            >
              <XIcon className="size-6" />
            </button>
          </DialogClose>
        )}
      </DialogContent>
    </Dialog>
  );
}

export {
  Modal,
  DialogClose as ModalClose,
  DialogDescription as ModalDescription,
  DialogTitle as ModalTitle,
  DialogTrigger as ModalTrigger,
};
