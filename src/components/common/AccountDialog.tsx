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
  illustrateId?: number | null;
  isProfileUpdating?: boolean;
  isAccountDeleting?: boolean;
  onProfileColorChange?: (illustrateId: number) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}

const DELETE_CONFIRM_TEXT = '계정을 삭제합니다';

export const defaultProfileOptions = [
  { illustrateId: 0, src: '/profile-default-1.svg', label: '기본 프로필 이미지 1' },
  { illustrateId: 1, src: '/profile-default-2.svg', label: '기본 프로필 이미지 2' },
  { illustrateId: 2, src: '/profile-default-3.svg', label: '기본 프로필 이미지 3' },
  { illustrateId: 3, src: '/profile-default-4.svg', label: '기본 프로필 이미지 4' },
  { illustrateId: 4, src: '/profile-default-5.svg', label: '기본 프로필 이미지 5' },
] as const;

export function getProfileOptionByIllustrateId(illustrateId: number | null | undefined) {
  return (
    defaultProfileOptions.find((option) => option.illustrateId === illustrateId) ??
    defaultProfileOptions[0]
  );
}

export function AccountDialog({
  open,
  onOpenChange,
  name = 'KKIUM',
  illustrateId,
  isProfileUpdating = false,
  isAccountDeleting = false,
  onProfileColorChange,
  onDelete,
}: AccountDialogProps) {
  const [view, setView] = React.useState<'account' | 'profile' | 'delete'>('account');
  const currentProfileOption = getProfileOptionByIllustrateId(illustrateId);
  const [selectedIllustrateId, setSelectedIllustrateId] = React.useState(
    currentProfileOption.illustrateId,
  );
  const previewProfileOption = getProfileOptionByIllustrateId(selectedIllustrateId);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState('');
  const hasProfileChange = selectedIllustrateId !== currentProfileOption.illustrateId;
  const canDeleteAccount = deleteConfirmText === DELETE_CONFIRM_TEXT && !isAccountDeleting;

  React.useEffect(() => {
    if (!open) return;

    setSelectedIllustrateId(currentProfileOption.illustrateId);
  }, [currentProfileOption.illustrateId, open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setView('account');
      setSelectedIllustrateId(currentProfileOption.illustrateId);
      setDeleteConfirmText('');
    }

    onOpenChange(nextOpen);
  };

  const openProfileView = () => {
    setSelectedIllustrateId(currentProfileOption.illustrateId);
    setView('profile');
  };

  const closeProfileView = () => {
    setSelectedIllustrateId(currentProfileOption.illustrateId);
    setView('account');
  };

  const saveProfile = async () => {
    if (!hasProfileChange || isProfileUpdating) return;

    try {
      await onProfileColorChange?.(selectedIllustrateId);
      setView('account');
    } catch (error) {
      console.error('Failed to update profile color:', error);
    }
  };

  const openDeleteView = () => {
    setDeleteConfirmText('');
    setView('delete');
  };

  const closeDeleteView = () => {
    setDeleteConfirmText('');
    setView('account');
  };

  const handleDeleteAccount = async () => {
    if (!canDeleteAccount) return;

    await onDelete?.();
    handleOpenChange(false);
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
      {view === 'account' || view === 'delete' ? (
        <>
          <AccountSummary
            name={name}
            profileSrc={currentProfileOption.src}
            onProfileChangeClick={openProfileView}
          />

          {view === 'account' ? (
            <div className="flex flex-col gap-7 border-t border-border-default pt-7">
              <Button
                type="button"
                variant="danger"
                className="w-fit body-1-bold"
                onClick={openDeleteView}
              >
                계정 삭제
              </Button>
            </div>
          ) : (
            <DeleteAccountPanel
              value={deleteConfirmText}
              canDelete={canDeleteAccount}
              isDeleting={isAccountDeleting}
              onChange={setDeleteConfirmText}
              onCancel={closeDeleteView}
              onDelete={handleDeleteAccount}
            />
          )}
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
                <ProfileImage src={previewProfileOption.src} size={114} priority />
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
                  const selected = selectedIllustrateId === option.illustrateId;

                  return (
                    <button
                      key={option.illustrateId}
                      type="button"
                      aria-label={option.label}
                      aria-pressed={selected}
                      className={cn(
                        'size-[88px] cursor-pointer overflow-hidden rounded-full transition-opacity focus-visible:shadow-focus-ring focus-visible:outline-none',
                        hasProfileChange && !selected && 'opacity-40',
                      )}
                      onClick={() => setSelectedIllustrateId(option.illustrateId)}
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

          <Button
            type="button"
            className="w-full"
            disabled={!hasProfileChange || isProfileUpdating}
            onClick={() => void saveProfile()}
          >
            프로필 변경하기
          </Button>
        </>
      )}
    </Modal>
  );
}

function AccountSummary({
  name,
  profileSrc,
  onProfileChangeClick,
}: {
  name: string;
  profileSrc: string;
  onProfileChangeClick: () => void;
}) {
  return (
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
            onClick={onProfileChangeClick}
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
  );
}

function DeleteAccountPanel({
  value,
  canDelete,
  isDeleting,
  onChange,
  onCancel,
  onDelete,
}: {
  value: string;
  canDelete: boolean;
  isDeleting: boolean;
  onChange: (value: string) => void;
  onCancel: () => void;
  onDelete: () => Promise<void> | void;
}) {
  return (
    <div className="flex flex-col gap-7 border-t border-border-default pt-7">
      <div className="flex flex-col gap-[13px] rounded-lg border border-red-200 bg-[#EF222F0D] px-5 py-6">
        <p className="body-2-bold text-danger">
          계정 삭제 후 30일 동안은 복구가 가능하며, 이후 모든 데이터가 영구적으로
          삭제됩니다. 계속하려면 “계정을 삭제합니다”를 입력하세요.
        </p>
        <TextField
          value={value}
          placeholder={DELETE_CONFIRM_TEXT}
          error
          description={false}
          className="border-danger bg-background-w focus-visible:border-danger focus-visible:bg-background-w aria-invalid:border-danger aria-invalid:bg-background-w"
          onChange={(event) => onChange(event.target.value)}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="danger"
            disabled={!canDelete || isDeleting}
            className="w-[87px]"
            onClick={() => void onDelete()}
          >
            계정 삭제
          </Button>
          <Button type="button" variant="line" className="w-[83px]" onClick={onCancel}>
            취소하기
          </Button>
        </div>
      </div>
    </div>
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
