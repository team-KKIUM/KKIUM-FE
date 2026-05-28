'use client';

import Image from 'next/image';
import * as React from 'react';

import { ArrowLeftIcon } from '@/components/common/icons/ArrowLeftIcon';
import { CameraIcon } from '@/components/common/icons/CameraIcon';
import { XIcon } from '@/components/common/icons/XIcon';
import { Modal, ModalClose, ModalTitle } from '@/components/common/Modal';
import { TextField } from '@/components/common/TextField';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name?: string;
}

const defaultProfileOptions = [
  { src: '/profile-default-1.svg', label: '기본 프로필 이미지 1' },
  { src: '/profile-default-2.svg', label: '기본 프로필 이미지 2' },
  { src: '/profile-default-3.svg', label: '기본 프로필 이미지 3' },
  { src: '/profile-default-4.svg', label: '기본 프로필 이미지 4' },
  { src: '/profile-default-5.svg', label: '기본 프로필 이미지 5' },
] as const;

export function AccountDialog({ open, onOpenChange, name = 'KKIUM' }: AccountDialogProps) {
  const [view, setView] = React.useState<'account' | 'profile'>('account');
  const [profileSrc, setProfileSrc] = React.useState<string>(defaultProfileOptions[0].src);
  const [selectedProfileSrc, setSelectedProfileSrc] = React.useState<string>(profileSrc);
  const hasProfileChange = selectedProfileSrc !== profileSrc;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setView('account');
      setSelectedProfileSrc(profileSrc);
    }

    onOpenChange(nextOpen);
  };

  const openProfileView = () => {
    setSelectedProfileSrc(profileSrc);
    setView('profile');
  };

  const closeProfileView = () => {
    setSelectedProfileSrc(profileSrc);
    setView('account');
  };

  const saveProfile = () => {
    setProfileSrc(selectedProfileSrc);
    setView('account');
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      contentClassName={cn(
        'w-[648px] max-w-[calc(100vw-2rem)] overflow-hidden border-0 px-[30px] py-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] sm:max-w-[648px]',
        view === 'profile' ? 'gap-8' : 'gap-[100px]',
      )}
    >
      {view === 'account' ? (
        <>
          <div className="flex flex-col gap-8">
            <header className="flex items-center justify-between">
              <ModalTitle className="title-1-bold text-black">계정</ModalTitle>
              <CloseButton ariaLabel="계정 모달 닫기" />
            </header>

            <div className="flex items-center justify-between">
              <div className="relative size-[116px] shrink-0">
                <ProfileImage src={profileSrc} size={114} priority />
                <button
                  type="button"
                  aria-label="프로필 이미지 변경"
                  className="absolute right-0 bottom-0 flex size-8 cursor-pointer items-center justify-center rounded-full border border-border-bold bg-background-default text-primary focus-visible:shadow-focus-ring focus-visible:outline-none"
                  onClick={openProfileView}
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
        </>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-8">
              <header className="flex h-8 items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="계정 화면으로 돌아가기"
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-background-w text-primary focus-visible:shadow-focus-ring focus-visible:outline-none"
                    onClick={closeProfileView}
                  >
                    <ArrowLeftIcon className="size-6" />
                  </button>
                  <ModalTitle className="title-1-bold text-black">프로필 변경</ModalTitle>
                </div>
                <CloseButton ariaLabel="프로필 변경 모달 닫기" />
              </header>

              <div className="flex h-[116px] items-center gap-6">
                <ProfileImage src={profileSrc} size={114} priority />
                <p className="text-[22px] leading-[1.48] font-extrabold text-primary">{name}</p>
              </div>
            </div>

            <div className="h-px w-full bg-border-default" />

            <section className="flex flex-col gap-3">
              <h2 className="text-[18px] leading-[1.48] font-bold text-primary">
                기본 프로필 이미지
              </h2>
              <div className="flex gap-8">
                {defaultProfileOptions.map((option) => {
                  const selected = selectedProfileSrc === option.src;

                  return (
                    <button
                      key={option.src}
                      type="button"
                      aria-label={option.label}
                      aria-pressed={selected}
                      className={cn(
                        'size-[88px] cursor-pointer overflow-hidden rounded-full transition-opacity focus-visible:shadow-focus-ring focus-visible:outline-none',
                        hasProfileChange && !selected && 'opacity-40',
                      )}
                      onClick={() => setSelectedProfileSrc(option.src)}
                    >
                      <Image
                        src={option.src}
                        alt=""
                        width={88}
                        height={88}
                        className="size-[88px]"
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <Button type="button" className="w-full" disabled={!hasProfileChange} onClick={saveProfile}>
            프로필 변경하기
          </Button>
        </>
      )}
    </Modal>
  );
}

function CloseButton({ ariaLabel }: { ariaLabel: string }) {
  return (
    <ModalClose asChild>
      <button
        type="button"
        aria-label={ariaLabel}
        className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-background-w text-primary focus-visible:shadow-focus-ring focus-visible:outline-none"
      >
        <XIcon className="size-6" />
      </button>
    </ModalClose>
  );
}

function ProfileImage({
  src,
  size,
  priority = false,
}: {
  src: string;
  size: 88 | 114;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-default',
        size === 114 ? 'size-[114px]' : 'size-[88px]',
      )}
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        priority={priority}
        className={cn(size === 114 ? 'size-[114px]' : 'size-[88px]')}
      />
    </div>
  );
}
