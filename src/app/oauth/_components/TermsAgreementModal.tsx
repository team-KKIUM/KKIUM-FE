'use client';

import * as React from 'react';
import Image from 'next/image';

import { requestTermsAgreement } from '@/app/_utils/authFetch';
import { PRIVACY_DETAIL_TEXT, TERMS_DETAIL_TEXT } from '@/app/oauth/_constants/termsAgreementTexts';
import { CheckButton } from '@/components/common/CheckButton';
import { XIcon } from '@/components/common/icons/XIcon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface TermsAgreementModalProps {
  open: boolean;
  onDismiss: () => void;
  onComplete: () => void;
}

type TermsDetailType = 'terms' | 'privacy' | null;

interface AgreementItemProps {
  checked: boolean;
  labelPrefix: string;
  labelAction: string;
  onCheckedChange: (nextChecked: boolean) => void;
  onOpenDetail: () => void;
}

function AgreementItem({
  checked,
  labelPrefix,
  labelAction,
  onCheckedChange,
  onOpenDetail,
}: AgreementItemProps) {
  return (
    <div className="inline-flex items-center">
      <CheckButton checked={checked} onCheckedChange={onCheckedChange} className="mr-1.5" />
      <p className="body-3-bold text-primary">
        <span>{labelPrefix}</span>{' '}
        <button
          type="button"
          className="underline outline-none focus-visible:shadow-focus-ring"
          onClick={onOpenDetail}
        >
          {labelAction}
        </button>
        <span>에 동의합니다.</span>
      </p>
    </div>
  );
}

interface TermsDetailViewProps {
  type: Exclude<TermsDetailType, null>;
  checked: boolean;
  onClose: () => void;
  onCheckedChange: (nextChecked: boolean) => void;
}

function TermsDetailView({
  type,
  checked,
  onClose,
  onCheckedChange,
}: TermsDetailViewProps) {
  const title = type === 'terms' ? '서비스 이용약관' : '개인정보 수집 및 이용';
  const text = type === 'terms' ? TERMS_DETAIL_TEXT : PRIVACY_DETAIL_TEXT;

  return (
    <div className="flex h-[704px] w-[622px] flex-col gap-6 rounded-xl border border-border-default bg-background-w px-7 py-5">
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <div className="inline-flex items-start justify-between">
          <h2 className="title-1-bold flex-1 text-strong">{title}</h2>
          <button
            type="button"
            aria-label="약관 상세 닫기"
            className="flex size-8 items-center justify-center rounded-full bg-background-w text-strong outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring"
            onClick={onClose}
          >
            <XIcon className="size-6" />
          </button>
        </div>
        <div className="border-t border-gray-300" />

        <div className="min-h-0 flex-1 overflow-y-auto pr-2">
          <p className="body-3-regular whitespace-pre-line text-strong">{text}</p>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        disabled={!checked}
        onClick={onClose}
        className="w-full"
      >
        저장하기
      </Button>
      <div className="inline-flex items-center">
        <CheckButton checked={checked} onCheckedChange={onCheckedChange} className="mr-1.5" />
        <span className="body-3-bold text-primary">약관 내용에 동의합니다.</span>
      </div>
    </div>
  );
}

export function TermsAgreementModal({ open, onDismiss, onComplete }: TermsAgreementModalProps) {
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [agreePrivacy, setAgreePrivacy] = React.useState(false);
  const [detailType, setDetailType] = React.useState<TermsDetailType>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setAgreeTerms(false);
      setAgreePrivacy(false);
      setDetailType(null);
      setIsSaving(false);
      setErrorMessage(null);
    }
  }, [open]);

  const allChecked = agreeTerms && agreePrivacy;

  const setAllChecked = (checked: boolean) => {
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
  };

  const handleSave = async () => {
    if (!allChecked || isSaving) return;

    setErrorMessage(null);
    setIsSaving(true);

    try {
      await requestTermsAgreement(true);
      onComplete();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '약관 동의 저장 중 오류가 발생했습니다.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="left-[calc((var(--app-content-left,0px)+100vw)/2)] flex w-auto max-w-none flex-col items-center justify-center border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-none"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">서비스 이용약관 및 개인정보 동의</DialogTitle>
        {detailType ? (
          <TermsDetailView
            type={detailType}
            checked={detailType === 'terms' ? agreeTerms : agreePrivacy}
            onClose={() => setDetailType(null)}
            onCheckedChange={(nextChecked) => {
              if (detailType === 'terms') {
                setAgreeTerms(nextChecked);
                return;
              }
              setAgreePrivacy(nextChecked);
            }}
          />
        ) : (
          <div className="flex h-[704px] w-[622px] flex-col gap-6 rounded-xl border border-border-default bg-background-w px-7 py-5">
            <div className="flex min-h-0 flex-1 flex-col justify-between">
              <div className="flex flex-col gap-3 overflow-hidden">
                <div className="inline-flex justify-end">
                  <button
                    type="button"
                    aria-label="동의 모달 닫기"
                    className="flex size-8 items-center justify-center rounded-full bg-background-w text-strong outline-none hover:bg-gray-100 focus-visible:shadow-focus-ring"
                    onClick={onDismiss}
                  >
                    <XIcon className="size-6" />
                  </button>
                </div>

                <div className="inline-flex items-center gap-3">
                  <div className="flex size-20 items-center justify-center rounded-lg">
                    <Image src="/file.svg" alt="KKIUM 로고" width={64} height={44} priority />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="heading-3-extra-bold text-strong">KKIUM</h2>
                    <p className="body-1-bold text-tertiary">
                      경험을 기록하고 분석하여 나만의 스토리를 완성하세요
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center">
                  <CheckButton
                    checked={allChecked}
                    onCheckedChange={setAllChecked}
                    className="mr-1.5"
                  />
                  <span className="body-1-bold text-strong">모두 동의합니다</span>
                </div>

                <div className="border-t border-gray-300" />

                <div className="flex flex-col gap-1.5">
                  <AgreementItem
                    checked={agreeTerms}
                    labelPrefix="(필수)"
                    labelAction="서비스 이용약관"
                    onCheckedChange={setAgreeTerms}
                    onOpenDetail={() => setDetailType('terms')}
                  />
                  <AgreementItem
                    checked={agreePrivacy}
                    labelPrefix="(필수)"
                    labelAction="개인정보 수집 및 이용"
                    onCheckedChange={setAgreePrivacy}
                    onOpenDetail={() => setDetailType('privacy')}
                  />
                </div>
              </div>

              <div className="mt-4">
                {errorMessage && <p className="mb-2 body-3-regular text-red-700">{errorMessage}</p>}
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  disabled={!allChecked || isSaving}
                  onClick={handleSave}
                >
                  동의하고 계속하기
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
