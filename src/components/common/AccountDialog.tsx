'use client';

import Image from 'next/image';

import { CameraIcon } from '@/components/common/icons/CameraIcon';
import { XIcon } from '@/components/common/icons/XIcon';
import { Modal, ModalClose, ModalTitle } from '@/components/common/Modal';
import { TextField } from '@/components/common/TextField';
import { Button } from '@/components/ui/button';

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name?: string;
}

export function AccountDialog({ open, onOpenChange, name = 'KKIUM' }: AccountDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      contentClassName="w-[648px] max-w-[calc(100vw-2rem)] gap-[100px] overflow-hidden border-0 px-[30px] py-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] sm:max-w-[648px]"
    >
      <div className="flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <ModalTitle className="title-1-bold text-black">계정</ModalTitle>
          <ModalClose asChild>
            <button
              type="button"
              aria-label="계정 모달 닫기"
              className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-background-w text-primary focus-visible:shadow-focus-ring focus-visible:outline-none"
            >
              <XIcon className="size-6" />
            </button>
          </ModalClose>
        </header>

        <div className="flex items-center justify-between">
          <div className="relative size-[116px] shrink-0">
            <div className="absolute top-0 left-0 flex size-[114px] items-center justify-center overflow-hidden rounded-full border border-border-default">
              <Image
                src="/profile.svg"
                alt=""
                width={114}
                height={114}
                priority
                className="size-[114px]"
              />
            </div>
            <button
              type="button"
              aria-label="프로필 이미지 변경"
              className="absolute right-0 bottom-0 flex size-8 cursor-pointer items-center justify-center rounded-full border border-border-bold bg-background-default text-primary focus-visible:shadow-focus-ring focus-visible:outline-none"
            >
              <CameraIcon className="size-6" />
            </button>
          </div>

          <label className="flex w-[410px] flex-col gap-1.5">
            <span className="body-2-bold text-black">이름</span>
            <TextField
              value={name}
              readOnly
              description={false}
              className="focus-visible:border-border-bold focus-visible:bg-background-w"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-7 border-t border-border-default pt-7">
        <Button type="button" variant="danger" className="w-fit body-1-bold">
          계정 삭제
        </Button>
      </div>
    </Modal>
  );
}
